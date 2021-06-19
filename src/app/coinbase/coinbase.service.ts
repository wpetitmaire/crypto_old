import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { AchatCrypto, Crypto, CryptoDAO, EtatCrypto, historiqueCrypto, transactionCrypto, VenteCrypto } from '../interfaces/daocrypto.interface';
import { CoinbaseConnexionService } from './coinbaseconnexion.service';

@Injectable({
  providedIn: 'root'
})
export class CoinbaseService implements CryptoDAO {

  constructor(private http: HttpClient) {}
  

  async etablirLaSante(idRessource: string, montantActuel: number): Promise<EtatCrypto> {
    let sommeVentes: number = 0;
    let sommeAchats: number = 0;

    let resultatAchats = await this.recupererLesAchats(idRessource);
    resultatAchats.forEach((achat) => sommeAchats += achat.totalNet.montant);

    let resultatVentes = await this.recupererLesVentes(idRessource);
    resultatVentes.forEach((vente) => sommeVentes += vente.totalNet.montant);

    return {
      montantTotalAchete: sommeAchats,
      montantTotalVendu: sommeVentes,
      sante: montantActuel - sommeAchats,
      enBenefice: montantActuel - sommeAchats > 0
    }
    
  }

  async recupererLesVentes(idRessource: string): Promise<VenteCrypto[]> {

    let urlRessource = `/v2/accounts/${idRessource}/sells`;
    let pageSuivante = false;
    let liste = [];
    
    do {
      let resultat: any = await CoinbaseConnexionService.requete('GET', urlRessource, '', this.http);

      // console.log('resultat : ', resultat)

      let listeAchats: VenteCrypto[] = [];

      resultat.data.forEach(sell => {
        listeAchats.push({
          id: sell.id,
          date: moment(sell.updated_at),
          statut: sell.status,
          montant: {
            montant: parseFloat(sell.amount.amount),
            unite: sell.amount.currency
          },
          frais: {
            montant: parseFloat(sell.fee.amount),
            unite: sell.fee.currency
          },
          totalBrut: {
            montant: parseFloat(sell.total.amount),
            unite: sell.total.currency
          },
          totalNet: {
            montant: parseFloat(sell.subtotal.amount),
            unite: sell.subtotal.currency
          },
          urlRessource: sell.resource_path
        });
      });

      liste = liste.concat(listeAchats);
      pageSuivante = resultat.pagination.next_uri != null;
      urlRessource = resultat.pagination.next_uri;

    } while (pageSuivante);

    // console.log("FIN : ", liste)

    return liste;
  }

  async recupererLesAchats(idRessource: string): Promise<AchatCrypto[]>{

    let urlRessource = `/v2/accounts/${idRessource}/buys`;
    let pageSuivante = false;
    let liste = [];
    
    do {
      let resultat: any = await CoinbaseConnexionService.requete('GET', urlRessource, '', this.http);

      // console.log('resultat : ', resultat)

      let listeAchats: AchatCrypto[] = [];

      resultat.data.forEach(buy => {
        listeAchats.push({
          id: buy.id,
          date: moment(buy.updated_at),
          statut: buy.status,
          montant: {
            montant: parseFloat(buy.amount.amount),
            unite: buy.amount.currency
          },
          frais: {
            montant: parseFloat(buy.fee.amount),
            unite: buy.fee.currency
          },
          totalBrut: {
            montant: parseFloat(buy.total.amount),
            unite: buy.total.currency
          },
          totalNet: {
            montant: parseFloat(buy.subtotal.amount),
            unite: buy.subtotal.currency
          },
          urlRessource: buy.resource_path
        });
      });

      liste = liste.concat(listeAchats);
      pageSuivante = resultat.pagination.next_uri != null;
      urlRessource = resultat.pagination.next_uri;

    } while (pageSuivante);

    // console.log("FIN : ", liste)

    return liste;
  }

  async recupererLesTransactions(idRessource: string): Promise<transactionCrypto[]> {

    let urlRessource = `/v2/accounts/${idRessource}/transactions`;
    let pageSuivante = false;
    let liste: transactionCrypto[] = [];
    
    do {
      let resultat: any = await CoinbaseConnexionService.requete('GET', urlRessource, '', this.http);

      // console.log('resultat : ', resultat)

      let listeTransactions: transactionCrypto[] = [];

      resultat.data.forEach((transaction: any) => {
        listeTransactions.push({
          id: transaction.id,
          urlVersRessource: transaction.resource_path,
          type_transaction: transaction.type,
          montantDestination: { 
            montant: parseFloat(transaction.amount.amount), 
            unite: transaction.amount.currency
          },
          description: transaction.description,
          montantSource: {
            montant: parseFloat(transaction.native_amount.amount),
            unite: transaction.native_amount.currency
          },
          status: transaction.status,
          date: moment(transaction.updated_at)
        });
      });

      liste = liste.concat(listeTransactions);
      pageSuivante = resultat.pagination.next_uri != null;
      urlRessource = resultat.pagination.next_uri;

    } while (pageSuivante);

    // console.log("FIN : ", liste)

    return liste;
  }

  async recupererHistoriqueSemainePassee(paire: string): Promise<historiqueCrypto[]> {

    const today = moment();
    let liste: historiqueCrypto[] = []

    for (let ind = 1; ind <= 7; ind++) {
      
      let dateConcernee = today.subtract(ind, 'days');
      let dateConcerneeStr = dateConcernee.format('YYYY[-]MM[-]DD');

      let resultat: any = await CoinbaseConnexionService.requete('GET', `/v2/prices/${paire}/spot?date=${dateConcerneeStr}`, '', this.http);   
      liste.push({ date: dateConcernee, prix: parseFloat(resultat.data.amount) });
    }

    return liste;

  }

  async recupererLesDoneesUtilisateur(): Promise<any> {
    return await CoinbaseConnexionService.requete('GET', '/v2/user', '', this.http);
  }

  async recupererLaListeDesPortefeuilles(): Promise<any> {
    return await CoinbaseConnexionService.requete('GET', `/v2/accounts?&limit=100`, '', this.http)
  }

  async recupererLesDoneesUnPortefeuille(id: string): Promise<any> {
    return await CoinbaseConnexionService.requete('GET', `/v2/accounts/${id}`, '', this.http)
  }

  async recupererLePrixDeLaPaire(base: string, monnaie: string): Promise<any>{
    return await CoinbaseConnexionService.requete('GET', `/v2/prices/${base.toUpperCase()}-${monnaie.toUpperCase()}/spot`, '', this.http)
  }

  async recupererToutesLesCryptoAcquises(monnaieUtilisateur: string): Promise<Crypto[]> {

    const donneesDesPortefeuilles = await this.recupererLaListeDesPortefeuilles();
    let liste: Crypto[] = [];

    Array.from(donneesDesPortefeuilles.data)
      .filter((ressource: any) => parseFloat(ressource.balance.amount) > 0)
      .forEach(async (ressource: any) => {

        console.log(`--> RESSOURCE ${ressource.currency.code} : `, ressource)

        const basePaire = ressource.currency.code;
        const paire = `${basePaire}-${monnaieUtilisateur}`;
        const idRessource = ressource.id;
        const urlIdRessource = ressource.resource_path;
        const prixDeLaPaire = await this.recupererLePrixDeLaPaire(ressource.currency.code, monnaieUtilisateur);
        const prixDuPortefeuille = parseFloat(prixDeLaPaire.data.amount)*ressource.balance.amount;
        const historiqueSemainePassee = await this.recupererHistoriqueSemainePassee(paire);
        const listeDesTransactions = await this.recupererLesTransactions(idRessource);
        const santePortefeuille = await this.etablirLaSante(idRessource, prixDuPortefeuille);

        liste.push({
          id: idRessource,
          nom: ressource.name,
          code: ressource.currency,
          quantite: ressource.balance.amount,
          prix_unitaire: prixDeLaPaire,
          historique_cours_semaine: historiqueSemainePassee,
          historique_des_mouvements: listeDesTransactions,
          etat: santePortefeuille
        });

      })

      return liste;
  }
}

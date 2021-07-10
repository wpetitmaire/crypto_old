import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { AchatCrypto, Crypto, CryptoDAO, EtatCrypto, EtatPortefeuilleGlobal, historiqueCrypto, transactionCrypto, VenteCrypto } from '../interfaces/daocrypto.interface';
import { CoinbaseConnexionService } from './coinbaseconnexion.service';

@Injectable({
  providedIn: 'root'
})
export class CoinbaseService implements CryptoDAO {

  constructor(private http: HttpClient) {}
  
  async etablirLaSanteGenerale() {

  }

  async etablirLaSantePourUneCrypto(idRessource: string, montantActuel: number): Promise<EtatCrypto> {
    let sommeVentes = 0;
    let sommeAchats = 0;
    let sommeFrais = 0;
    let sommeDepensee = 0;
    

    let resultatAchats = await this.recupererLesAchats(idRessource);
    resultatAchats.forEach((achat) => {
      sommeAchats += achat.totalNet.montant;
      sommeFrais += achat.frais.montant;
      sommeDepensee += achat.totalBrut.montant;
    });

    let resultatVentes = await this.recupererLesVentes(idRessource);
    resultatVentes.forEach((vente) => sommeVentes += vente.totalNet.montant);

    return {
      totalAchete: sommeAchats,
      totalVendu: sommeVentes,
      totalFrais: sommeFrais,
      totalDepense: sommeDepensee,
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

  async recupererHistoriqueSemainePassee(paire: string): Promise<historiqueCrypto> {

    const today = moment();
    let liste: historiqueCrypto;
    let listeDate: string[] = [];
    let listePrix: number[] = [];

    for (let ind = 1; ind <= 7; ind++) {
      
      let dateConcernee = today.subtract(ind, 'days');
      let dateConcerneeStr = dateConcernee.format('YYYY[-]MM[-]DD');

      let resultat: any = await CoinbaseConnexionService.requete('GET', `/v2/prices/${paire}/spot?date=${dateConcerneeStr}`, '', this.http);   
      // liste.push({ date: dateConcernee, prix: parseFloat(resultat.data.amount) });
      listeDate.push(dateConcerneeStr);
      listePrix.push(parseFloat(resultat.data.amount));
    }

    liste = {
      dates: listeDate,
      prix: listePrix
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

  async recupererEtatPortefeuille(monnaieUtilisateur: string): Promise<EtatPortefeuilleGlobal> {

    const donneesDesPortefeuilles = await this.recupererLaListeDesPortefeuilles();
    let liste: Crypto[] = [];
    let globalAchete = 0;
    let globalVendu = 0;
    let globalFrais = 0;
    let globalDepense = 0;
    let globalsante = 0;
    let etatbenefice = false;
    let sommePrixPortefeuille = 0;

    let listeDesRessources = Array.from(donneesDesPortefeuilles.data)
      .filter((ressource: any) => parseFloat(ressource.balance.amount) > 0);

    await Promise.all(listeDesRessources.map(async (ressource:any) => {

        console.log(`--> RESSOURCE ${ressource.currency.code} : `, ressource);

        const basePaire = ressource.currency.code;
        const paire = `${basePaire}-${monnaieUtilisateur}`;
        const idRessource = ressource.id;
        const urlIdRessource = ressource.resource_path;
        const prixDeLaPaire = await this.recupererLePrixDeLaPaire(ressource.currency.code, monnaieUtilisateur);
        const prixDuPortefeuille = parseFloat(prixDeLaPaire.data.amount) * ressource.balance.amount;
        const historiqueSemainePassee = await this.recupererHistoriqueSemainePassee(paire);
        const listeDesTransactions = await this.recupererLesTransactions(idRessource);
        const santePortefeuille = await this.etablirLaSantePourUneCrypto(idRessource, prixDuPortefeuille);

        console.log(`--> Santé ${ressource.currency.code} : `, santePortefeuille);

        liste.push({
          id: idRessource,
          nom: ressource.name,
          code: ressource.currency,
          quantite: ressource.balance.amount,
          prix: prixDuPortefeuille,
          prix_unitaire: prixDeLaPaire,
          historique_cours_semaine: historiqueSemainePassee,
          historique_des_mouvements: listeDesTransactions,
          etat: santePortefeuille
        });

        globalAchete += santePortefeuille.totalAchete;
        globalVendu += santePortefeuille.totalVendu;
        globalFrais += santePortefeuille.totalFrais;
        globalDepense += santePortefeuille.totalDepense;
        globalsante += santePortefeuille.sante;
        etatbenefice = globalsante >= 0
        sommePrixPortefeuille += prixDuPortefeuille;
    }))

    return {
      cryptos: liste,
      etat: {
        totalAchete: globalAchete,
        totalVendu: globalVendu,
        totalFrais: globalFrais,
        totalDepense: globalDepense,
        sante: globalsante,
        enBenefice: globalsante >= 0
      },
      sommePrix: sommePrixPortefeuille
    };
  }
}

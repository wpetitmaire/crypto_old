import { Observable } from "rxjs";


export interface Crypto {
    id: string, // Identifiant de la crypto
    nom: string, // Nom de la crypto
    code: string, // Code de la crypto
    quantite: number // Quantité de crypto dans la portefeuille
    prix: number, // Prix du portefeuille
    prix_unitaire: number, // Prix unitaire de la crypto
    prix_unitaire_date_variation: number, // Prix unitaire de la crypto à la date de variation
    historique_cours_semaine: historiqueCrypto,
    historique_des_mouvements: transactionCrypto[],
    etat: EtatPortefeuille
    etatDateVariation?: EtatPortefeuille
    variation?: { pourcentage: number, valeur: number }
    variation_prix?: { pourcentage: number, valeur: number }
}

export interface historiqueCrypto {
    dates: string[],
    prix: number[]
}

enum typeTransaction { 
    send, // Envoi de bitcoin/bitcoin cash/litecoin/ethereum à une adresse ou un e-mail bitcoin/bitcoin cash/litecoin/ethereum
    request, // Bitcoin/bitcoin cash/litecoin/ethereum demandé par un utilisateur ou par e-mail
    transfer, // Fonds transférés entre deux des comptes d'un utilisateur
    buy, // Achat
    sell, // Vente
    fiat_deposit, // Fonds déposés sur compte fiat
    fiat_withdrawal, // Retrait de fond depuis compte fiat
    exchange_deposit, // Fonds déposés sur Coinbase Pro
    exchange_withdrawal, // Retrait fonds depuis Coinbase Pro
    vault_withdrawal // Retrait de fonds d'un compte de coffre-fort
}
enum statutTransaction {
    pending, // En cours
    completed, // Terminé
    failed, // Échec
    expired, // Expiré
    canceled, // Annulé
    waiting_for_signature, // Le retrait du coffre-fort est en attente d'approbation
    waiting_for_clearing, // Le retrait du coffre-fort attend d'être effacé
}

interface MontantCrypto {
    montant: number,
    unite: string
}

export interface transactionCrypto {
    id: string,
    urlVersRessource: string,
    type_transaction: typeTransaction,
    montantDestination: MontantCrypto,
    description?: string,
    montantSource: MontantCrypto,
    status: statutTransaction,
    date: moment.Moment
}

export enum InputTypeTransaction {
    Achats, Ventes, Tout
}

export enum EtatAchatCrypto { created, completed, canceled }

export interface AchatCrypto {
    id: string,
    date: moment.Moment,
    statut: EtatAchatCrypto,
    montant: MontantCrypto,
    frais: MontantCrypto,
    totalBrut: MontantCrypto,
    totalNet: MontantCrypto,
    urlRessource: string
}

export interface VenteCrypto {
    id: string,
    date: moment.Moment,
    statut: EtatAchatCrypto,
    montant: MontantCrypto,
    frais: MontantCrypto,
    totalBrut: MontantCrypto,
    totalNet: MontantCrypto,
    urlRessource: string
}

export interface EtatPortefeuille {
    totalAchete: number,
    totalVendu: number,
    totalFrais: number,
    totalDepense: number,
    totalPrix?: number
    sante: number,
    enBenefice: boolean,
}

export interface EtatPortefeuilleGlobal {
    cryptos: Crypto[],
    etat: EtatPortefeuille,
    etatDateVariation?: EtatPortefeuille,
    variation?: {
        sante: {
            pourcentage: number,
            valeur: number
        },
        etat: {
            pourcentage: number,
            valeur: number
        }
    }
}


export interface CryptoDAO {
    recupererEtatPortefeuille(monnaieUtilisateur: string): Promise<EtatPortefeuilleGlobal>
    recupererEtatPortefeuilleSurDatePrecise(monnaieUtilisateur: string, date: moment.Moment): Promise<any>

    recupererLesDoneesUtilisateur(): Promise<any>
    recupererLaListeDesPortefeuilles(): Promise<any>
    recupererLesDoneesUnPortefeuille(id: string): Promise<any>
    recupererLePrixDeLaPaire(base: string, monnaie: string): Promise<any>
    recupererHistoriqueSemainePassee(paire: string): Promise<historiqueCrypto>
    recupererLesTransactions(idRessource: string, typeDeTransaction: InputTypeTransaction): Promise<transactionCrypto[]>
    etablirLaSantePourUneCrypto(idRessource: string, montantActuel: number): Promise<EtatPortefeuille>
}
import { Component, OnInit } from '@angular/core';
import { CoinbaseService } from './coinbase.service';
import { Crypto, EtatCrypto, EtatPortefeuilleGlobal } from '../interfaces/daocrypto.interface';
import { CoinbaseConnexionService } from './coinbaseconnexion.service';

@Component({
  selector: 'app-recapitulatif',
  templateUrl: './recapitulatif.component.html',
  styles: [
  ]
})
export class RecapitulatifComponent implements OnInit {

  

  private donneesUtilisateur: any; 
  private userId: string;
  private monnaieUtilisateur: string;
  listeCryptos: Crypto[];
  etatGlobal: EtatPortefeuilleGlobal;

  constructor(private coinbaseService: CoinbaseService) { }

  async ngOnInit(): Promise<void> {

    this.donneesUtilisateur = await this.coinbaseService.recupererLesDoneesUtilisateur();
    this.userId = this.donneesUtilisateur.data.id;
    this.monnaieUtilisateur = this.donneesUtilisateur.data.native_currency;
    this.etatGlobal = await this.coinbaseService.recupererEtatPortefeuille(this.monnaieUtilisateur);
    this.listeCryptos = this.etatGlobal.cryptos;


    console.log("etatGlobal : ", this.etatGlobal)
    

  }
}
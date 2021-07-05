import { Component, OnInit } from '@angular/core';
import { CoinbaseService } from './coinbase.service';
import { Crypto } from '../interfaces/daocrypto.interface';
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

  constructor(private coinbaseService: CoinbaseService) { }

  async ngOnInit(): Promise<void> {

    this.donneesUtilisateur = await this.coinbaseService.recupererLesDoneesUtilisateur();
    this.userId = this.donneesUtilisateur.data.id;
    this.monnaieUtilisateur = this.donneesUtilisateur.data.native_currency;
    this.listeCryptos = await this.coinbaseService.recupererToutesLesCryptoAcquises(this.monnaieUtilisateur);



    console.log("listeCryptos : ", this.listeCryptos)
    

  }
}
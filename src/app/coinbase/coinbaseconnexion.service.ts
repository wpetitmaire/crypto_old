import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export  class CoinbaseConnexionService {

  // Accès aux données d'un portefeuille CoinBase
  private static API_KEY = environment.COINBASE_API_KEY;
  private static SECRET_KEY = environment.COINBASE_SECRET_KEY;
  private static BASE_URL = environment.COINBASE_BASE_URL;
  private static API_VERSION = environment.COINBASE_API_VERSION;

  constructor() {}

  /**
   * Crée et retourne la signature cryptée.
   * @param timestamp Temps en secondes Unix
   * @param method 'GET/POST/PUT'
   * @param requestPath Url de la ressource
   * @param body Corps de la réponse
   * @returns signature encodée en SHA256 avec l'API secrète
   */
  private static getSignature(timestamp: string, method: string, requestPath: string, body: string): string {

    let prehash = timestamp + method.toUpperCase() + requestPath;

    if(method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT') {
      prehash += body;
    }

    let cryptSign = CryptoJS.HmacSHA256(prehash, this.SECRET_KEY);
    let encoded = CryptoJS.enc.Hex.stringify(cryptSign);

    return encoded;
  }

  /**
   * Créer et retourne les entêtes à utiliser pour utiliser l'API de Coinbase
   * @param signature Signature crytpée 
   * @param timestamp Temps unix en seconde
   * @returns Les entêtes HTTP interroger l'API
   */
  private static getHttpHeaders(signature: string, timestamp: number) {
    return new HttpHeaders()
      .append('CB-ACCESS-KEY', CoinbaseConnexionService.API_KEY)
      .append('CB-ACCESS-SIGN', signature)
      .append('CB-ACCESS-TIMESTAMP', timestamp.toString())
      .append('Accept-Language', 'fr')
      .append('CB-VERSION', '2021-06-03')
  }


  static async requete(httpMethod: string, requestPath: string, payload: string, http: HttpClient): Promise<any> {
    // requestPath = this.API_VERSION+requestPath;
    const timestamp = Math.floor(new Date().getTime() * 1e-3)
    const signature = this.getSignature(timestamp.toString(), httpMethod, requestPath, payload);
    const headers = this.getHttpHeaders(signature, timestamp);

    return http.get(this.BASE_URL + requestPath, { headers }).toPromise()
  }

}

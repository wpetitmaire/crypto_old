import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CoinbaseService } from './coinbase.service';

@Component({
  selector: 'app-recapitulatif',
  templateUrl: './recapitulatif.component.html',
  styles: [
  ]
})
export class RecapitulatifComponent implements OnInit {

  constructor(private coinBaseService: CoinbaseService, private http: HttpClient) { }

  ngOnInit(): void {

    console.log("-->TEST")

    CoinbaseService.requete('GET', '/user', '', this.http).subscribe(result => console.log(result))
    
  }

}

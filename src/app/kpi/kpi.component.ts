import { Component, Input, OnInit } from '@angular/core';



@Component({
  selector: 'app-kpi',
  templateUrl: './kpi.component.html',
  styleUrls: ['./kpi.component.scss']
})
export class KpiComponent implements OnInit {

  @Input() titre: string;
  @Input() valeur: number;
  @Input() type:  "date" | "number" | "string" | "currency";
  @Input() neutre: boolean = false
  @Input() variationPourcentage: number;
  @Input() variationValeur: number;
  @Input() typeVariation: "pourcentage" | "valeur" = "valeur"

  constructor() {

  }

  ngOnInit(): void {}

  variationNegative(): boolean {
    if(this.typeVariation == 'pourcentage' && this.variationPourcentage < 0)
      return true;

    if(this.typeVariation == 'valeur' && this.variationValeur < 0)
      return true;

    return false;
  }
}

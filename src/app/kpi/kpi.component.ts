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

  constructor() {
    // this.titre = "Acheté";
    // this.valeur = 1200 
    // this.type = "currency";
  }

  ngOnInit(): void {
  }
}

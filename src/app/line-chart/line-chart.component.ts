import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  @Input()
  get values(): number[] { return this.datas[0].data; }
  set values(values: number[]) {
    this.datas = [ { data: values} ];
  }
  public datas = [ { data: []} ];

  // @Input() datas; 
  @Input() labels;

  @Input() 
  get borderColor(): string { return this.listeCouleurs[0].borderColor };
  set borderColor(color: string) {
    this.listeCouleurs[0].borderColor = color;
  }

  @Input() 
  get backgroundColor(): string { return this.listeCouleurs[0].backgroundColor };
  set backgroundColor(color: string) {
    this.listeCouleurs[0].backgroundColor = color;
  }
  
  public listeCouleurs = [
    {
      borderColor: '',
      backgroundColor: ''
    }
  ];

  public typeDeGraphique = 'line';


  public options = {
    responsive: true,
    legend: {
      display: false,
    },
    tooltips: {enabled: false},
    hover: {mode: null},
    elements: {
      point:{
          radius: 0
      }
    },
    scales: {
      xAxes: [
        {
          display: false
        }
      ],
      yAxes: [
        {
          display: false
        }
      ]
    }
  };

  constructor() { }

  ngOnInit(): void {

    console.log("--> INIT");
    console.log(this.labels)
    console.log(this.values)
    console.log(this.listeCouleurs)
  }
}

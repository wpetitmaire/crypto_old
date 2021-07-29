import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecapitulatifComponent } from './coinbase/recapitulatif.component';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { LineChartComponent } from './line-chart/line-chart.component';
import { KpiComponent } from './kpi/kpi.component';
import {MatIconModule} from '@angular/material/icon';
registerLocaleData(localeFr);
@NgModule({
  declarations: [
    AppComponent,
    RecapitulatifComponent,
    LineChartComponent,
    KpiComponent,
    
  ],
  imports: [
    MatIconModule,
    MDBBootstrapModule.forRoot(),
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    { provide: APP_BASE_HREF, useValue: '/apps/crypto' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

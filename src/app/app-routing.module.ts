import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecapitulatifComponent } from './coinbase/recapitulatif.component';

const routes: Routes = [
  { path: '', component: RecapitulatifComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

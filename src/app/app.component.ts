import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!--Navbar-->
    <mdb-navbar SideClass="navbar navbar-expand-lg navbar-dark fixed-top indigo">

      <!-- Navbar brand -->
      <mdb-navbar-brand><a class="navbar-brand" href="#">Crypto</a></mdb-navbar-brand>

      <!-- Collapsible content -->
      <links>

        <!-- Links -->
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
              <a class="nav-link waves-light" mdbWavesEffect>Home<span class="sr-only">(current)</span></a>
          </li>
          <!-- <li class="nav-item">
              <a class="nav-link waves-light" mdbWavesEffect>Features</a>
          </li>
          <li class="nav-item">
              <a class="nav-link waves-light" mdbWavesEffect>Pricing</a>
          </li> -->
        </ul>
      </links>
    </mdb-navbar>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  title = 'crypto';
}

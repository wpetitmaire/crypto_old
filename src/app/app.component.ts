import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <!--Navbar-->
    <mdb-navbar SideClass="navbar navbar-expand-lg navbar-dark fixed-top indigo">
      <mdb-navbar-brand><a class="navbar-brand" href="#">Crypto</a></mdb-navbar-brand>
      <links>
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
              <a class="nav-link waves-light" mdbWavesEffect>Home<span class="sr-only">(current)</span></a>
          </li>
        </ul>
      </links>
    </mdb-navbar>
    <!-- Main -->
    <main>
      <div class="container" style="padding-top: 10px;">
          <div class="row pt-5">
            <router-outlet></router-outlet>
          </div>
      </div>
    </main>
    
  `,
  styles: []
})
export class AppComponent {
  title = 'crypto';
}

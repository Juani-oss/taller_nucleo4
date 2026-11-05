import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Sesion } from '../../services/sesion';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-nav-bar',
  styleUrl: './nav-bar.css',
  templateUrl: './nav-bar.html',
})
export class NavBar {

  sesion = inject(Sesion)
  router = inject(Router)

  cerrar() {
    this.sesion.cerrar()
    this.router.navigate(["/login"])
  }
}

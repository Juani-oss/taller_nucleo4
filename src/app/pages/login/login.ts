import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Sesion } from '../../services/sesion';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  email = ""
  password = ""
  error = signal("")

  sesion = inject(Sesion)
  router = inject(Router)

  login() {
    this.error.set("")
    this.sesion.login(this.email, this.password).subscribe({
      next: (correcto) => {
        if (correcto) {
          this.router.navigate([this.sesion.esAdmin() ? "/panel" : "/catalogo"])
        } else {
          this.error.set("Correo o contraseña incorrectos")
        }
      },
      error: () => this.error.set("No se pudo conectar con la base de datos"),
    })
  }
}

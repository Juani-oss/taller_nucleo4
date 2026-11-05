import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Sesion } from '../../services/sesion';

@Component({
  imports: [FormsModule],
  selector: 'app-registro',
  styleUrl: './registro.css',
  templateUrl: './registro.html',
})
export class Registro {

  nombre = ""
  email = ""
  password = ""
  error = signal("")

  sesion = inject(Sesion)
  router = inject(Router)

  registrar() {
    this.error.set("")
    this.sesion.registrar(this.nombre, this.email, this.password).subscribe({
      next: (creado) => {
        if (creado) {
          this.router.navigate(["/login"])
        } else {
          this.error.set("Ese correo ya está registrado")
        }
      },
      error: () => this.error.set("No se pudo conectar con la base de datos"),
    })
  }
}

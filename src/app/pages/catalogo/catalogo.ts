import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Producto } from '../../models';
import { Datos, PRODUCTOS } from '../../services/datos';

@Component({
  imports: [CurrencyPipe],
  selector: 'app-catalogo',
  styleUrl: './catalogo.css',
  templateUrl: './catalogo.html',
})
export class Catalogo {

  datos = inject(Datos)

  productos = signal<Producto[]>([])
  error = signal("")

  constructor() {
    this.datos.listar<Producto>(PRODUCTOS).subscribe({
      next: (productos) => this.productos.set(productos),
      error: () => this.error.set("No se pudieron cargar los productos"),
    })
  }
}

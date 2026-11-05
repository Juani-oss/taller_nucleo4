import { CurrencyPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Producto } from '../../models';
import { Datos, PRODUCTOS } from '../../services/datos';

@Component({
  imports: [CurrencyPipe, FormsModule],
  selector: 'app-panel',
  styleUrl: './panel.css',
  templateUrl: './panel.html',
})
export class Panel {

  datos = inject(Datos)

  productos = signal<Producto[]>([])
  error = signal("")

  editandoId = signal("")
  nombre = signal("")
  categoria = signal("")
  marca = signal("")
  precio = signal<number | null>(null)
  stock = signal<number | null>(null)
  imagen = signal("")

  constructor() {
    this.cargar()
  }

  cargar() {
    this.datos.listar<Producto>(PRODUCTOS).subscribe({
      next: (productos) => this.productos.set(productos),
      error: () => this.error.set("No se pudieron cargar los productos"),
    })
  }

  guardar() {
    const producto: Producto = {
      nombre: this.nombre(),
      categoria: this.categoria(),
      marca: this.marca(),
      precio: this.precio() ?? 0,
      stock: this.stock() ?? 0,
      imagen: this.imagen(),
    }
    const id = this.editandoId()
    const operacion = id
      ? this.datos.actualizar(PRODUCTOS, id, producto)
      : this.datos.crear(PRODUCTOS, producto)

    this.error.set("")
    operacion.subscribe({
      next: () => {
        this.limpiar()
        this.cargar()
      },
      error: () => this.error.set("No se pudo guardar el producto"),
    })
  }

  editar(producto: Producto) {
    this.editandoId.set(producto.id ?? "")
    this.nombre.set(producto.nombre)
    this.categoria.set(producto.categoria)
    this.marca.set(producto.marca)
    this.precio.set(producto.precio)
    this.stock.set(producto.stock)
    this.imagen.set(producto.imagen ?? "")
  }

  eliminar(producto: Producto) {
    if (!producto.id || !confirm(`¿Eliminar ${producto.nombre || "este producto"}?`)) {
      return
    }
    this.error.set("")
    this.datos.eliminar(PRODUCTOS, producto.id).subscribe({
      next: () => this.cargar(),
      error: () => this.error.set("No se pudo eliminar el producto"),
    })
  }

  limpiar() {
    this.editandoId.set("")
    this.nombre.set("")
    this.categoria.set("")
    this.marca.set("")
    this.precio.set(null)
    this.stock.set(null)
    this.imagen.set("")
  }
}

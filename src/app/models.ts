export type Rol = 'admin' | 'estandar';

export interface Usuario {
  id?: string
  nombre: string
  email: string
  password: string
  rol: Rol
}

export interface Producto {
  id?: string
  nombre: string
  categoria: string
  marca: string
  precio: number | null
  stock: number | null
  imagen?: string
}

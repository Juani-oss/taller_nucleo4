import { computed, inject, Service, signal } from '@angular/core';
import { from, map, of, switchMap, tap } from 'rxjs';
import { Rol, Usuario } from '../models';
import { Datos, USUARIOS } from './datos';

export interface UsuarioSesion {
  nombre: string
  email: string
  rol: Rol
}

const CLAVE = "sesion"

@Service()
export class Sesion {

  private datos = inject(Datos)

  usuario = signal<UsuarioSesion | null>(this.leer())
  autenticado = computed(() => this.usuario() !== null)
  esAdmin = computed(() => this.usuario()?.rol === 'admin')

  login(email: string, password: string) {
    const correo = this.normalizar(email)
    return from(this.cifrar(correo, password)).pipe(
      switchMap((cifrada) =>
        this.datos.buscar<Usuario>(USUARIOS, 'email', correo).pipe(
          map((usuarios) => usuarios.find((u) => u.password === cifrada))
        )
      ),
      tap((usuario) => {
        if (usuario) {
          this.guardar(usuario)
        }
      }),
      map((usuario) => usuario !== undefined)
    )
  }

  registrar(nombre: string, email: string, password: string) {
    const correo = this.normalizar(email)
    return this.datos.buscar<Usuario>(USUARIOS, 'email', correo).pipe(
      switchMap((existentes) => {
        if (existentes.length > 0) {
          return of(false)
        }
        return from(this.cifrar(correo, password)).pipe(
          switchMap((cifrada) => {
            const nuevo: Usuario = { nombre, email: correo, password: cifrada, rol: 'estandar' }
            return this.datos.crear(USUARIOS, nuevo)
          }),
          map(() => true)
        )
      })
    )
  }

  cerrar() {
    localStorage.removeItem(CLAVE)
    this.usuario.set(null)
  }

  private guardar({ nombre, email, rol }: Usuario) {
    const usuario: UsuarioSesion = { nombre, email, rol }
    localStorage.setItem(CLAVE, JSON.stringify(usuario))
    this.usuario.set(usuario)
  }

  private leer(): UsuarioSesion | null {
    try {
      return JSON.parse(localStorage.getItem(CLAVE) ?? "null")
    } catch {
      return null
    }
  }

  private normalizar(email: string) {
    return email.trim().toLowerCase()
  }

  private async cifrar(email: string, password: string) {
    const bytes = new TextEncoder().encode(email + password)
    const resumen = await crypto.subtle.digest('SHA-256', bytes)
    return Array.from(new Uint8Array(resumen))
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('')
  }
}

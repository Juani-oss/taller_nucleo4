import { Observable } from 'rxjs';

export const PRODUCTOS = "productos"
export const USUARIOS = "usuarios"

export abstract class Datos {
  abstract listar<T>(coleccion: string): Observable<T[]>
  abstract buscar<T>(coleccion: string, campo: string, valor: string): Observable<T[]>
  abstract crear(coleccion: string, item: object): Observable<unknown>
  abstract actualizar(coleccion: string, id: string, item: object): Observable<unknown>
  abstract eliminar(coleccion: string, id: string): Observable<unknown>
}

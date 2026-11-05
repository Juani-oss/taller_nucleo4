import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Datos } from './datos';

@Service()
export class DatosApi extends Datos {

  private API = "http://localhost:3000"
  private http = inject(HttpClient)

  listar<T>(coleccion: string) {
    return this.http.get<T[]>(`${this.API}/${coleccion}`)
  }

  buscar<T>(coleccion: string, campo: string, valor: string) {
    return this.http.get<T[]>(`${this.API}/${coleccion}`, { params: { [campo]: valor } })
  }

  crear(coleccion: string, item: object) {
    return this.http.post(`${this.API}/${coleccion}`, item)
  }

  actualizar(coleccion: string, id: string, item: object) {
    return this.http.patch(`${this.API}/${coleccion}/${id}`, item)
  }

  eliminar(coleccion: string, id: string) {
    return this.http.delete(`${this.API}/${coleccion}/${id}`)
  }
}

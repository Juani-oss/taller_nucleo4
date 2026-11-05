import { Service } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  QuerySnapshot,
  updateDoc,
  where,
} from 'firebase/firestore';
import { from, map } from 'rxjs';
import firebaseConfig from './firebase.config.json';
import { Datos } from './datos';

@Service()
export class DatosFirestore extends Datos {

  private db = getFirestore(initializeApp(firebaseConfig))

  listar<T>(coleccion: string) {
    return from(getDocs(collection(this.db, coleccion))).pipe(
      map((resultado) => this.convertir<T>(resultado))
    )
  }

  buscar<T>(coleccion: string, campo: string, valor: string) {
    const consulta = query(collection(this.db, coleccion), where(campo, '==', valor))
    return from(getDocs(consulta)).pipe(
      map((resultado) => this.convertir<T>(resultado))
    )
  }

  crear(coleccion: string, item: object) {
    return from(addDoc(collection(this.db, coleccion), item))
  }

  actualizar(coleccion: string, id: string, item: object) {
    return from(updateDoc(doc(this.db, coleccion, id), { ...item }))
  }

  eliminar(coleccion: string, id: string) {
    return from(deleteDoc(doc(this.db, coleccion, id)))
  }

  private convertir<T>(resultado: QuerySnapshot) {
    return resultado.docs.map((documento) => ({ ...documento.data(), id: documento.id }) as T)
  }
}

import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Nota } from '../model/nota';
import { Usuario } from '../model/usuario';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotasService {

  private myCollection: AngularFirestoreCollection<any>;

  constructor(private fire: AngularFirestore,
    private authS: AuthService) {
    this.myCollection = fire.collection<any>(authS.user.email);
  }

  cargarColeccion() {
    this.myCollection = this.fire.collection<any>(this.authS.user.email)
  }

  /**
   * Método para agregar una nueva nota
   * @param nuevaNota Nota a agregar
   * @returns Promise<any>
   */
  agregaNota(nuevaNota: Nota): Promise<any> {
    return this.myCollection.add(nuevaNota);
  }

  /**
   * Método para leer todas las notas
   * @returns Observable<any>
   */
  leeNotas(): Observable<any> {
    return this.myCollection.get();
  }

  /**
   * Método para leer una nota
   * @param id Id de la nota a leer
   * @returns Observable<any>
   */
  leeNota(id: any): Observable<any> {
    return this.myCollection.doc(id).get();
  }

  /**
   * Método para actualizar una nota en específico
   * @param id Id de la nota a actualizar
   * @param nuevaNota Nota reemplazante
   * @returns Promise<void>
   */
  actualizarNota(id: any, nuevaNota: Nota): Promise<void> {
    return this.myCollection.doc(id).set(nuevaNota);
  }

  /**
   * Método para borrar una nota
   * @param id Id de la nota a eliminar
   * @returns Promise<void>
   */
  borraNota(id: any): Promise<void> {
    return this.myCollection.doc(id).delete();
  }

  /**
   * Método para leer una nota por su título
   * @param titulo Titulo de la nota en específico
   * @returns Observable<any>
   */
  leeNotaPorTitulo(titulo: string): Observable<any> {
    return this.myCollection.doc(titulo).get();
  }

  /**
   * Método para leer notas por su fecha
   * @param fecha Fecha de las notas
   * @returns Observable<any>
   */
  leeNotasPorFecha(fecha: any): Observable<any> {
    return this.myCollection.doc(fecha).get();
  }

}
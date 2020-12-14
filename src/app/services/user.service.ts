import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<any>;

  constructor(private fire: AngularFirestore) {
    this.userCollection = this.fire.collection<any>('users');
  }

  cargarDocumento() {
    this.userCollection = this.fire.collection<any>('users');
  }

  agregaUsuario(nuevoUsuario: Usuario): Promise<any> {
    return this.userCollection.add(nuevoUsuario);
  }

  borraUsuario(email: any): Promise<void> {
    return this.userCollection.doc(email).delete();
  }

  obtenerUsuario(email: any): Observable<any> {
    return this.userCollection.doc(email).get();
  }

  obtenerUsuarios(): Observable<any> {
    return this.userCollection.get();
  }

}

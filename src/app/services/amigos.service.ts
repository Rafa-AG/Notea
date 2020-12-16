import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { Amigo } from '../model/amigo';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AmigosService {

  private friendCollection: AngularFirestoreCollection<any>;

  constructor(private fire: AngularFirestore,
    private authS: AuthService) {
    this.friendCollection = this.fire.collection<any>(authS.user.email)
  }

  cargarColeccion() {
    this.friendCollection = this.fire.collection<any>(this.authS.user.email)
  }

  agregaAmigo(amigo: Amigo): Promise<any> {
    return this.friendCollection.add(amigo);
  }

  obtenerAmigos(): Observable<any> {
    return this.friendCollection.get();
  }

}
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Usuario } from '../model/usuario';
import { AuthService } from './auth.service';
import { NotasService } from './notas.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private document: AngularFirestoreDocument<any>;

  constructor(private fire: AngularFirestore,
    private authS: AuthService,
    private notasS: NotasService) {
    
  }

  public cargarDocumento() {
    
  }

}

import { Injectable, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class AmigosService {

  public listaAmigos = [];
  private users = []
  public userLogged = {
    id: 0,
    nombre: '',
    email: ''
  }

  constructor(private httpS: HttpService,
    private authS: AuthService) {
  }

  public async cargaDatos(): Promise<any> {
    try {
      await this.httpS.getAllUsers().then((res) => {
        let data = res.data;
        data = JSON.parse(data);
        this.users = data;
        this.users.forEach((u) => {
          if (u.email === this.authS.user.email) {
            this.userLogged = u;
          }
        })
      })
      return this.httpS.obtenerAmigos(this.userLogged.id)
    } catch (err) {
      console.log(err)
    }
  }

  public isFriend(email: string): boolean {
    let result: boolean = false;
    this.listaAmigos.forEach((u) => {
      if (u.email === email) {
        result = true;
      }
    })
    return result;
  }

}

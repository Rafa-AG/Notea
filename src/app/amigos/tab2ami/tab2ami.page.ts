import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { NotasService } from 'src/app/services/notas.service';

@Component({
  selector: 'app-tab2ami',
  templateUrl: './tab2ami.page.html',
  styleUrls: ['./tab2ami.page.scss'],
})
export class Tab2amiPage implements OnInit {

  private listaUsuarios = [];
  private listaAmigos = [];
  private auxA = [];
  private tmp = [];
  private items = [];
  private user = {
    id: 0,
    email: '',
    nombre: ''
  };

  constructor(private authS: AuthService,
    private httpS: HttpService) { }

  ngOnInit() {
    this.userLogged();
    this.authS.cargaUsuarios();
    this.cargaDatos();
  }

  public cargaDatos($event = null) {
    try {
      this.getFriends();
      this.httpS.getAllUsers().then((res) => {
        let data = res.data;
        this.tmp = JSON.parse(data);
        this.tmp.forEach((u) => {
          if (this.isFriend(u.email) === false && u.email !== this.user.email && this.isInside(u.email) === false) {
            this.listaUsuarios.push(u);
            this.items = this.listaUsuarios;
          }
        })
        if ($event) {
          $event.target.complete();
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  public async getFriends() {
    this.userLogged();
    try {
      let aux = [];
      await this.httpS.obtenerAmigos(this.user.id).then((res) => {
        let data = res.data;
        this.auxA = JSON.parse(data);
        console.log(this.auxA)
        this.auxA.forEach((u) => {
          this.httpS.getUserByID(u.amigo).then((res) => {
            let d = res.data;
            aux = JSON.parse(d);
            aux.forEach((a) => {
              if (this.isFriend(a.email) === false) {
                this.listaAmigos.push(a);
              }
            })
          })
        })
      })
    } catch (err) {
      console.log(err);
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

  public isInside(email: string): boolean {
    let result: boolean = false;
    this.listaUsuarios.forEach((u) => {
      if (u.email === email) {
        result = true;
      }
    })
    return result;
  }

  public userLogged() {
    let aux = [];
    this.httpS.getAllUsers().then((res) => {
      let data = res.data;
      data = JSON.parse(data);
      aux = data;
      aux.forEach((u) => {
        if (u.email === this.authS.user.email) {
          this.user = u;
        }
      })
    }).catch((err) => {
      console.log(err);
    })
  }

  public searchItems(ev: any) {
    const val = ev.target.value;
    this.items = this.listaUsuarios;
    if (val && val.trim() !== '') {
      this.items = this.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}
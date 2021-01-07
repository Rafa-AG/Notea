import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-tab1ami',
  templateUrl: './tab1ami.page.html',
  styleUrls: ['./tab1ami.page.scss'],
})
export class Tab1amiPage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;

  private listaAmigos = [];
  private tmp = [];
  private items = [];
  private user = {
    id: 0,
    email: '',
    nombre: ''
  };

  constructor(private httpS: HttpService,
    private authS: AuthService) { }

  ngOnInit() {
    this.authS.cargaUsuarios();
    this.cargaDatos();
  }

  public cargaDatos($event = null) {
    this.userLogged();
    try {
      this.httpS.obtenerAmigos(this.user.id).then((res) => {
        let data = res.data;
        data = JSON.parse(data);
        this.tmp = data;
        this.getFriends();
        if ($event) {
          $event.target.complete();
        }
      })
    } catch (err) {
      console.log(err);
    }
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

  public getFriends() {
    let aux = [];
    this.tmp.forEach((u) => {
      this.httpS.getUserByID(u.amigo).then((res) => {
        let data = res.data;
        data = JSON.parse(data);
        aux = data;
        aux.forEach((a) => {
          if (this.isFriend(a.email) === false) {
            this.listaAmigos.push(a);
            this.items = this.listaAmigos;
          }
        })
      }).catch((err) => {
        console.log(err);
      })
    })
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

  public searchItems(ev: any) {
    const val = ev.target.value;
    this.items = this.listaAmigos;
    if (val && val.trim() !== '') {
      this.items = this.items.filter((item) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  /*public prueba() {
    this.http.get('https://ralba-restful.herokuapp.com/clientes', {}, { 'apikey': 'proyectoIonic' }).then((res) => {
      console.log(res);
      let data = res.data;
      data = JSON.parse(data);
      console.log(data)
    }).catch((err) => {
      console.log(err)
    })
  }*/

  /*public obtener() {
    this.httpS.obtenerNota(1).then((res) => {
      let data = res.data;
      this.prueba = JSON.parse(data);
      console.log(this.prueba)
    }).catch((err) => {
      console.log(err)
    })
  }

  public insertar() {
    this.httpS.insertarNota('prueba', 'esto es otra prueba loco', 1).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    })
  }

  public eliminar() {
    this.httpS.eliminarNota(4).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    })
  }

  public editar(){
    this.httpS.editarNota(1, 'otra prueba', 'es una prueba para editar', 1).then((res)=>{
      console.log(res);
    }).catch((err)=>{
      console.log(err)
    })
  }
  
  public obtener(){
    this.httpS.getUserByEmail('joeplays69@gmail.com').then((res) => {
      let data = res.data;
      data = JSON.parse(data);
      console.log(data);
    }).catch((err)=>{
      console.log(err)
    })
  }*/

}

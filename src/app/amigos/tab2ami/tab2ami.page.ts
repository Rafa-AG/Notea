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
  private items = [];
  private user;

  constructor(private authS: AuthService,
    private httpS: HttpService) { }

  ngOnInit() {
    this.userLogged();
    this.cargaDatos();
  }

  public cargaDatos($event = null) {
    try {
      this.httpS.obtenerUsuarios().then((res) => {
        let aux = []
        let data = res.data;
        data = JSON.parse(data);
        aux = data;
        aux.forEach((u) => {
          if (u.email !== this.authS.user.email) {
            this.listaUsuarios.push(u);
            this.items = this.listaUsuarios;
          }
        })
      })
    } catch (err) {
      console.log(err);
    }
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

  public userLogged() {
    let aux = [];
    this.httpS.obtenerUsuarios().then((res) => {
      let data = res.data;
      data = JSON.parse(data);
      aux = data;
      aux.forEach((u) => {
        if (u.email === this.authS.user.email) {
          this.user = u;
        }
      })
    })
  }

}
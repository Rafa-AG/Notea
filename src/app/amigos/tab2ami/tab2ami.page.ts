import { Component, OnInit } from '@angular/core';
import { Amigo } from 'src/app/model/amigo';
import { AmigosService } from 'src/app/services/amigos.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotasService } from 'src/app/services/notas.service';

@Component({
  selector: 'app-tab2ami',
  templateUrl: './tab2ami.page.html',
  styleUrls: ['./tab2ami.page.scss'],
})
export class Tab2amiPage implements OnInit {

  private listaUsuarios = [];
  private listaAmigos = [];
  private items = [];
  private amigo: Amigo = {
    email: '',
    nombre: ''
  }

  constructor(private userS: UserService,
    private amigoS: AmigosService,
    private authS: AuthService,
    private notasS: NotasService) { }

  ngOnInit() {
    this.userS.cargarColeccion();
    this.notasS.cargarColeccion();
    this.amigoS.cargarColeccion();
    this.cargaDatos();
  }

  public cargaDatos($event = null) {
    try {
      this.notasS.leeNotas()
        .subscribe((info: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
          this.listaAmigos = [];
          info.forEach((doc) => {
            let amigo = {
              ...doc.data()
            }
            this.listaAmigos.push(amigo);
          });
          if (this.listaAmigos.length > 0) {
            let tmp = []
            this.listaAmigos.forEach((a) => {
              if (a.email != null) {
                tmp.push(a);
              }
            })
            this.listaAmigos = tmp;
          }
          if ($event) {
            $event.target.complete();
          }
        })
      this.userS.obtenerUsuarios()
        .subscribe((info: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
          this.listaUsuarios = [];
          info.forEach((doc) => {
            let user = {
              ...doc.data()
            }
            if (user.email !== this.authS.user.email) {
              this.listaUsuarios.push(user);
              this.items = this.listaUsuarios
            }
          });
          if (this.listaAmigos.length > 0) {
            let tmp = []
            this.listaAmigos.forEach((a) => {
              this.listaUsuarios.forEach((u) => {
                if (a.email !== u.email) {
                  tmp.push(u)
                }
              })
            })
            this.listaUsuarios = tmp;
            this.items = this.listaUsuarios
          }
          if ($event) {
            $event.target.complete();
          }
        })
    } catch (err) {
      console.log(err);
    }
  }

  obtenerUsuario(email: string): any {
    let user;
    try {
      this.userS.obtenerUsuarios().subscribe((info: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
        info.forEach((doc) => {
          user = {
            ...doc.data()
          }
          this.items.push(user)
        })
        this.items.forEach((u) => {
          if (u.email === email) {
            return u;
          }
        })
      })
    } catch (err) {
      console.log(err);
    }
  }

  añadirAmigo(amigo: Amigo) {
    this.amigoS.agregaAmigo(amigo).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err)
    })
  }

  hacerAmigo(email: string) {
    if (email != null) {
      this.listaUsuarios.forEach((u) => {
        if (u.email === email) {
          this.amigo = {
            email: u.email,
            nombre: u.name
          }
        }
      })
      this.añadirAmigo(this.amigo);
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

}
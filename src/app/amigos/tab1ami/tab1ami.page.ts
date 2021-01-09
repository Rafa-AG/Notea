import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonSearchbar } from '@ionic/angular';
import { AmigosService } from 'src/app/services/amigos.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-tab1ami',
  templateUrl: './tab1ami.page.html',
  styleUrls: ['./tab1ami.page.scss'],
})
export class Tab1amiPage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;

  private listaAmigos = [];
  private items = [];
  private tmp = [];

  private user = {
    id: 0,
    nombre: '',
    email: ''
  }

  constructor(private httpS: HttpService,
    private authS: AuthService,
    private amigoS: AmigosService,
    private loadingS: LoadingService,
    private actionSheetController: ActionSheetController,
    private alert: AlertController) { }

  ngOnInit() {
    this.authS.cargaUsuarios();
    this.cargaDatos();
  }

  public async cargaDatos($event = null) {
    try {
      await this.userLogged()
      this.amigoS.cargaDatos().then((res) => {
        let data = res.data;
        this.tmp = JSON.parse(data)
        this.tmp.forEach((u) => {
          this.httpS.getUserByID(u.amigo).then((resu) => {
            let aux = []
            let d = resu.data;
            aux = JSON.parse(d);
            aux.forEach((a) => {
              if (this.isFriend(a.email) === false) {
                this.listaAmigos.push(a);
                this.items = this.listaAmigos
              }
            })
          })
        })
        if ($event) {
          $event.target.complete();
        }
      })
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

  deleteFriend(id: number) {
    try {
      this.httpS.eliminarAmigo(id).then((res) => {
        console.log(res)
      })
    } catch (err) {
      console.log(err)
    }
  }

  public async deleteFriends(friend: number) {
    try {
      await this.loadingS.presentLoading();
      this.httpS.obtenerAmigos(this.user.id).then((res) => {
        let aux = []
        let data = res.data;
        aux = JSON.parse(data);
        aux.forEach((a) => {
          if (a.amigo === friend) {
            this.deleteFriend(a.id);
          }
        })
        let tmp = [];
        this.listaAmigos.forEach((a) => {
          if (a.id != friend) {
            tmp.push(a);
          }
        })
        this.listaAmigos = tmp
        this.items = this.listaAmigos
        this.httpS.obtenerAmigos(friend).then((res) => {
          let tmp = []
          let data = res.data
          tmp = JSON.parse(data)
          tmp.forEach((a) => {
            if (a.amigo === this.user.id) {
              this.deleteFriend(a.id)
            }
          })
        })
        this.loadingS.stopLoading();
      })
    } catch (err) {
      console.log(err);
      this.loadingS.stopLoading();
    }
  }

  async actionSheet(friend: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Eliminar Amigo',
        icon: 'person-remove-outline',
        handler: () => {
          this.presentAlertConfirm(friend);
        }
      },
      {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  public async presentAlertConfirm(friend: any) {
    const alert = await this.alert.create({
      cssClass: 'alertDelete',
      header: 'Eliminar Amigo',
      message: '¿Está seguro de que quiere eliminar este usuario de su lista de amigos?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Eliminar',
          cssClass: 'delete',
          handler: () => {
            this.deleteFriends(friend);
          }
        }
      ]
    });
    await alert.present();
  }

  async userLogged() {
    try {
      await this.httpS.getAllUsers().then((res) => {
        let tmp = []
        let data = res.data;
        data = JSON.parse(data);
        tmp = data;
        tmp.forEach((u) => {
          if (u.email === this.authS.user.email) {
            this.user = u;
          }
        })
      })
    } catch (err) {
      console.log(err)
    }
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

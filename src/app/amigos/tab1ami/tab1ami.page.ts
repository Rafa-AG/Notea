import { Component, OnInit, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonSearchbar } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AmigosService } from 'src/app/services/amigos.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { ServiciosService } from 'src/app/services/servicios.service';

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
    private actionSheetController: ActionSheetController,
    private alert: AlertController,
    private servicios: ServiciosService,
    private translate: TranslateService) { }

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
      await this.servicios.presentLoading();
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
        this.servicios.stopLoading();
      })
    } catch (err) {
      console.log(err);
      this.servicios.stopLoading();
    }
  }

  async actionSheet(friend: number) {
    try {
      let header, del, cancel;
      this.translate.get('OPCIONES').subscribe((res: string) => {
        header = res
      })
      this.translate.get('ELIMINAR AMIGO').subscribe((res: string) => {
        del = res
      })
      this.translate.get('CANCELAR').subscribe((res: string) => {
        cancel = res
      })
      const actionSheet = await this.actionSheetController.create({
        header: header,
        cssClass: 'my-custom-class',
        buttons: [{
          text: del,
          icon: 'person-remove-outline',
          handler: () => {
            this.presentAlertConfirm(friend);
          }
        },
        {
          text: cancel,
          icon: 'close',
          role: 'cancel',
          handler: () => {
          }
        }]
      });
      await actionSheet.present();
    } catch (err) {
      console.log(err)
    }
  }

  public async presentAlertConfirm(friend: any) {
    try {
      let header, message, del, cancel;
      this.translate.get('ELIMINAR AMIGO').subscribe((res: string) => {
        header = res
      })
      this.translate.get('CONFIRMACION ELIMINAR AMIGO').subscribe((res: string) => {
        message = res
      })
      this.translate.get('ELIMINAR').subscribe((res: string) => {
        del = res
      })
      this.translate.get('CANCELAR').subscribe((res: string) => {
        cancel = res
      })
      const alert = await this.alert.create({
        cssClass: 'alertDelete',
        header: header,
        message: message,
        buttons: [
          {
            text: cancel,
            role: 'cancel',
            cssClass: 'cancel',
            handler: () => {
            }
          }, {
            text: del,
            cssClass: 'delete',
            handler: () => {
              this.deleteFriends(friend);
            }
          }
        ]
      });
      await alert.present();
    } catch (err) {
      console.log(err)
    }
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

}

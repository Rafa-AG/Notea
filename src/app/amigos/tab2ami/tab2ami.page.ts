import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AmigosService } from 'src/app/services/amigos.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { ServiciosService } from 'src/app/services/servicios.service';

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

  constructor(private authS: AuthService,
    private httpS: HttpService,
    private amigoS: AmigosService,
    private servicios: ServiciosService,
    private actionSheetController: ActionSheetController,
    private translate: TranslateService) { }

  async ngOnInit() {
    this.authS.cargaUsuarios();
    await this.cargaDatos();
  }

  public async cargaDatos($event = null) {
    try {
      await this.getFriends()
      this.httpS.getAllUsers().then((res) => {
        let data = res.data;
        this.tmp = JSON.parse(data);
        this.tmp.forEach((u) => {
          if (this.isFriend(u.email) == false && u.email !== this.amigoS.userLogged.email && this.isInside(u.email) === false) {
            this.listaUsuarios.push(u)
            this.items = this.listaUsuarios
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
    try {
      await this.amigoS.cargaDatos().then((res) => {
        let data = res.data;
        this.auxA = JSON.parse(data)
        this.auxA.forEach((u) => {
          this.httpS.getUserByID(u.amigo).then((resu) => {
            let aux = []
            let d = resu.data;
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

  async addFriend(friend: number) {
    try {
      await this.servicios.presentLoading();
      this.httpS.añadirAmigo(this.amigoS.userLogged.id, friend).then((res) => {
        console.log(res)
        let tmp = [];
        this.listaUsuarios.forEach((u) => {
          if (u.id != friend) {
            tmp.push(u);
          }
        })
        this.listaUsuarios = tmp;
        this.items = this.listaUsuarios;
        this.servicios.stopLoading();
      })
    } catch (err) {
      console.log(err);
      this.servicios.stopLoading();
    }
  }

  async actionSheet(friend: number) {
    try {
      let header, add, cancel
      this.translate.get('OPCIONES').subscribe((res: string) => {
        header = res
      })
      this.translate.get('AÑADIR AMIGO').subscribe((res: string) => {
        add = res
      })
      this.translate.get('CANCELAR').subscribe((res: string) => {
        cancel = res
      })
      const actionSheet = await this.actionSheetController.create({
        header: header,
        cssClass: 'my-custom-class',
        buttons: [{
          text: add,
          icon: 'person-add-outline',
          handler: () => {
            this.addFriend(friend);
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

  public searchItems(ev: any) {
    const val = ev.target.value;
    this.items = this.listaUsuarios;
    if (val && val.trim() !== '') {
      this.items = this.items.filter((item) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}
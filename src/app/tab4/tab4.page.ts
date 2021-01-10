import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonSearchbar, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Chat } from '../model/chat';
import { EditChatPage } from '../pages/edit-chat/edit-chat.page';
import { FriendsPage } from '../pages/friends/friends.page';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;

  public chats = [];

  public items: any;

  private user = {
    id: 0,
    nombre: '',
    email: ''
  }

  constructor(private httpS: HttpService,
    private authS: AuthService,
    private modalController: ModalController,
    private alert: AlertController,
    private translateS:TranslateService) { }

  ionViewDidEnter() {
    this.authS.cargaUsuarios();
    this.cargaDatos();
  }

  ngOnInit() {
  }

  public async cargaDatos($event = null) {
    try {
      await this.userLogged()
      this.httpS.getAllChats().then((res) => {
        let tmp = []
        let aux = []
        let data = res.data;
        tmp = JSON.parse(data);
        tmp.forEach((c) => {
          if (this.isInside(c.id) === false) {
            aux = c.usuarios
            aux.forEach((u) => {
              if (u === this.user.id) {
                let chat: Chat = {
                  id: c.id,
                  titulo: c.titulo,
                  texto: c.texto,
                  usuarios: c.usuarios
                }
                this.chats.push(chat);
                this.items = this.chats
              }
            })
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

  public deleteChat(id: number) {
    this.httpS.deleteChat(id).then((res) => {
      console.log(res)
      let tmp = []
      this.chats.forEach((c) => {
        if (c.id != id) {
          tmp.push(c)
        }
      })
      this.chats = tmp
      this.items = this.chats
    }).catch((err) => {
      console.log(err)
    })
  }

  public async editChat(chat: Chat) {
    const modal = await this.modalController.create({
      component: EditChatPage,
      cssClass: 'my-custom-class',
      componentProps: {
        chat: chat
      }
    });
    modal.present();

    return await modal.onDidDismiss().then((load) => {
      this.cargaDatos();
    })
  }

  public async presentAlertConfirm(id: any) {
    try{
      let header, message, cancel, del;
      this.translateS.get('BORRADO').subscribe((res:string)=>{
        header=res
      })
      this.translateS.get('CONFIRMACION BORRADO NOTA COMPARTIDA').subscribe((res:string)=>{
        message=res
      })
      this.translateS.get('CANCELAR').subscribe((res:string)=>{
        cancel=res
      })
      this.translateS.get('ELIMINAR').subscribe((res:string)=>{
        del=res
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
              this.deleteChat(id);
            }
          }
        ]
      });
      await alert.present();
    }catch(err){
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

  public isInside(id: number): boolean {
    let result: boolean = false;
    this.chats.forEach((c) => {
      if (c.id === id) {
        result = true;
      }
    })
    return result;
  }

  public createChat() {

  }

  public async goFriendsPage() {
    const modal = await this.modalController.create({
      component: FriendsPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  public searchItems(ev: any) {
    const val = ev.target.value;
    this.items = this.chats;
    if (val && val.trim() !== '') {
      this.items = this.items.filter((item) => {
        return (item.titulo.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.texto.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}

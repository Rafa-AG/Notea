import { Component, Input, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Amigo } from 'src/app/model/amigo';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { ChatPage } from '../chat/chat.page';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {

  private amigos = []

  public listaChat: Amigo[] = []

  private user = {
    id: 0,
    nombre: '',
    email: ''
  }

  constructor(private modalController: ModalController,
    private httpS: HttpService,
    private authS: AuthService) { }

  async ionViewDidEnter() {
    await this.cargaDatos();
  }

  ngOnInit() {
  }

  public async cargaDatos($event = null) {
    try {
      await this.userLogged();
      this.httpS.obtenerAmigos(this.user.id).then((res) => {
        let tmp = []
        let data = res.data;
        tmp = JSON.parse(data);
        tmp.forEach((a) => {
          this.httpS.getUserByID(a.amigo).then((res) => {
            let tmp = []
            let data = res.data;
            tmp = JSON.parse(data);
            tmp.forEach((u) => {
              if (this.isInside(u.id) === false) {
                let amigo: Amigo = {
                  id: u.id,
                  nombre: u.nombre,
                  email: u.email,
                  inside: false
                }
                this.amigos.push(amigo)
              }
            })
          })
        })
        if ($event) {
          $event.target.complete();
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  public addToChat() {
    this.amigos.forEach((a) => {
      if (a.inside && this.isInChat(a.id) === false) {
        this.listaChat.push(a)
      }
    })
    this.goChat();
  }

  isInside(id: number): boolean {
    let result: boolean = false;
    if (this.amigos.length > 0) {
      this.amigos.forEach((a) => {
        if (a.id === id) {
          result = true
        }
      })
    }
    return result;
  }

  isInChat(id: number): boolean {
    let result: boolean = false;
    if (this.listaChat.length > 0) {
      this.listaChat.forEach((c) => {
        if (c.id === id) {
          result = true
        }
      })
    }
    return result
  }

  public async goChat() {
    this.modalController.dismiss();
    const modal = await this.modalController.create({
      component: ChatPage,
      cssClass: 'my-custom-class',
      componentProps: {
        amigos: this.amigos
      }
    });
    modal.present();

    return await modal.onDidDismiss().then((load) => {
      this.cargaDatos();
    })
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

  public goBack() {
    this.modalController.dismiss();
  }

}

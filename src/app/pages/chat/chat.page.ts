import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { Amigo } from 'src/app/model/amigo';
import { Chat } from 'src/app/model/chat';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { ServiciosService } from 'src/app/services/servicios.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @Input('amigo') amigos: Amigo[];

  public closeFriends: boolean = false;

  public tasks: FormGroup

  private listaChat = []

  private user = {
    id: 0,
    nombre: '',
    email: ''
  }

  constructor(private formBuilder: FormBuilder,
    private httpS: HttpService,
    private authS: AuthService,
    private servicios:ServiciosService,
    private modalController: ModalController,
    private alert:AlertController) {
    this.tasks = this.formBuilder.group({
      titulo: ['', Validators.required],
      texto: ['']
    })
  }

  async ionViewDidEnter() {
    await this.cargaDatos();
  }

  ngOnInit() {

  }

  public async cargaDatos($event = null) {
    try {
      await this.userLogged();
      this.amigos.forEach((a) => {
        this.listaChat.push(a.id)
      })
      this.listaChat.push(this.user.id)
      if ($event) {
        $event.target.complete();
      }
    } catch (err) {
      console.log(err);
    }
  }

  public async presentAlertConfirm() {
    const alert = await this.alert.create({
      cssClass: 'alertDelete',
      header: 'Cancelar',
      message: '¿Está seguro de que quiere salir sin guardar la nota?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Sí',
          cssClass: 'delete',
          handler: () => {
            this.goBack();
          }
        }
      ]
    });

    await alert.present();
  }

  public async sendForm() {
    try {
      await this.servicios.presentLoading();
      console.log(this.listaChat)
      let data: Chat = {
        id: 0,
        titulo: this.tasks.get('titulo').value,
        texto: this.tasks.get('texto').value,
        usuarios: this.listaChat
      }
      this.httpS.createChat(data).then((res) => {
        this.tasks.setValue({
          titulo: '',
          texto: ''
        })
        this.servicios.stopLoading();
        this.servicios.presentToast('Nota guardada');
        this.modalController.dismiss();
      })
    } catch (err) {
      this.servicios.stopLoading();
      this.servicios.presentToast('Error al guardar la nota');
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

  public goBack() {
    this.modalController.dismiss();
  }

}

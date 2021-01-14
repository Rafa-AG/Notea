import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
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
    private servicios: ServiciosService,
    private modalController: ModalController,
    private alert: AlertController,
    private translate: TranslateService) {
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
      this.listaChat=[]
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
    try {
      let header, message, no, si;
      this.translate.get('CANCELAR').subscribe((res: string) => {
        header = res
      })
      this.translate.get('CONFIRMACION CANCELAR GUARDADO').subscribe((res: string) => {
        message = res
      })
      this.translate.get('NO').subscribe((res: string) => {
        no = res
      })
      this.translate.get('SI').subscribe((res: string) => {
        si = res
      })
      const alert = await this.alert.create({
        cssClass: 'alertDelete',
        header: header,
        message: message,
        buttons: [
          {
            text: no,
            role: 'cancel',
            cssClass: 'cancel',
            handler: () => {
            }
          }, {
            text: si,
            cssClass: 'delete',
            handler: () => {
              this.goBack();
            }
          }
        ]
      });
      await alert.present();
    } catch (err) {
      console.log(err)
    }
  }

  public async sendForm() {
    try {
      let guardada;
      this.translate.get('NOTA GUARDADA').subscribe((res: string) => {
        guardada = res
      })
      await this.servicios.presentLoading();
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
        this.servicios.presentToast(guardada);
        this.modalController.dismiss();
      })
    } catch (err) {
      let error;
      this.translate.get('ERROR GUARDADO').subscribe((res: string) => {
        error = res
      })
      this.servicios.stopLoading();
      this.servicios.presentToast(error);
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

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Chat } from 'src/app/model/chat';
import { HttpService } from 'src/app/services/http.service';
import { ServiciosService } from 'src/app/services/servicios.service';

@Component({
  selector: 'app-edit-chat',
  templateUrl: './edit-chat.page.html',
  styleUrls: ['./edit-chat.page.scss'],
})
export class EditChatPage implements OnInit {

  @Input('chat') chat: Chat;

  public tasks: FormGroup;

  constructor(private modalController: ModalController,
    private alert: AlertController,
    private formBuilder: FormBuilder,
    private httpS: HttpService,
    private servicios: ServiciosService,
    private translate: TranslateService) {
    this.tasks = this.formBuilder.group({
      titulo: ['', Validators.required],
      texto: ['']
    })
  }

  ionViewDidEnter() {
    this.tasks.get('titulo').setValue(this.chat.titulo)
    this.tasks.get('texto').setValue(this.chat.texto)
  }

  ngOnInit() {
  }

  public async sendForm() {
    try {
      let guardada;
      this.translate.get('NOTA GUARDADA').subscribe((res: string) => {
        guardada = res
      })
      await this.servicios.presentLoading();
      let data: Chat = {
        id: this.chat.id,
        titulo: this.tasks.get('titulo').value,
        texto: this.tasks.get('texto').value,
        usuarios: this.chat.usuarios
      }
      this.httpS.editChat(data).then((res) => {
        this.servicios.stopLoading();
        this.servicios.presentToast(guardada);
        this.modalController.dismiss();
      })
    } catch (err) {
      let error;
      this.translate.get('ERROR GUARDADO').subscribe((res: string) => {
        error = res
      })
      console.log(err)
      this.servicios.stopLoading();
      this.servicios.presentToast(error);
    }
  }

  public goBack() {
    this.modalController.dismiss();
  }

  public async presentAlertConfirm() {
    try{
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
    }catch(err){
      console.log(err)
    }
  }

}

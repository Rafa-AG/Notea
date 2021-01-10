import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
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
    private httpS:HttpService,
    private servicios:ServiciosService) {
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
    await this.servicios.presentLoading();
    let data: Chat = {
      id: this.chat.id,
      titulo: this.tasks.get('titulo').value,
      texto: this.tasks.get('texto').value,
      usuarios: this.chat.usuarios
    }
    this.httpS.editChat(data).then((res) => {
      this.servicios.stopLoading();
      this.servicios.presentToast('Nota guardada');
      this.modalController.dismiss();
    }).catch((err) => {
      console.log(err)
      this.servicios.stopLoading();
      this.servicios.presentToast('Error al guardar la nota');
    })
  }

  public goBack() {
    this.modalController.dismiss();
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

}

import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Nota } from 'src/app/model/nota';
import { HttpService } from 'src/app/services/http.service';
import { ServiciosService } from 'src/app/services/servicios.service';

@Component({
  selector: 'app-edit-nota',
  templateUrl: './edit-nota.page.html',
  styleUrls: ['./edit-nota.page.scss'],
})
export class EditNotaPage implements OnInit {

  @Input('nota') nota: Nota;

  public tasks: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private modalController: ModalController,
    private alertC: AlertController,
    private servicios: ServiciosService,
    private httpS: HttpService,
    private translate: TranslateService) {
    this.tasks = this.formBuilder.group({
      title: ['', Validators.required],
      description: [''],
      favorite: []
    })
  }

  ngOnInit() {
  }

  /**
   * Method to set values of nota to tasks
   */
  ionViewDidEnter() {
    this.tasks.get('title').setValue(this.nota.titulo)
    this.tasks.get('description').setValue(this.nota.texto)
    this.tasks.get('favorite').setValue(this.nota.favorito)
  }

  /**
   * Method to change values of nota and come back to Tab1
   */
  public async sendForm() {
    try {
      let guardada;
      this.translate.get('NOTA GUARDADA').subscribe((res: string) => {
        guardada = res
      })
      await this.servicios.presentLoading();
      let data: Nota = {
        id: this.nota.id,
        titulo: this.tasks.get('title').value,
        texto: this.tasks.get('description').value,
        favorito: this.tasks.get('favorite').value
      }
      this.httpS.editarNota(data).then((res) => {
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

  /**
   * Method to close Modal and come back to Tab1
   */
  public goBack() {
    this.modalController.dismiss();
  }

  /**
   * Method to ask if user want to close Modal without saving
   */
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
      const alert = await this.alertC.create({
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

}

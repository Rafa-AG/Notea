import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
import { Nota } from 'src/app/model/nota';
import { NotasService } from 'src/app/services/notas.service';

@Component({
  selector: 'app-edit-nota',
  templateUrl: './edit-nota.page.html',
  styleUrls: ['./edit-nota.page.scss'],
})
export class EditNotaPage implements OnInit {

  @Input('nota') nota: Nota;

  public tasks: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private notasS: NotasService,
    public loadingController: LoadingController,
    public toastController: ToastController,
    private modalController: ModalController,
    private alert:AlertController) {
      this.tasks = this.formBuilder.group({
        title: ['', Validators.required],
        description: [''],
        favorite:[]
      })
    }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.tasks.get('title').setValue(this.nota.titulo)
    this.tasks.get('description').setValue(this.nota.texto)
    this.tasks.get('favorite').setValue(this.nota.favorito)
  }

  public async sendForm() {
    await this.presentLoading();
    let data: Nota = {
      titulo: this.tasks.get('title').value,
      texto: this.tasks.get('description').value,
      favorito: this.tasks.get('favorite').value
    }
    this.notasS.actualizarNota(this.nota.id, data)
      .then((respuesta) => {
        this.loadingController.dismiss();
        this.presentToast('Nota guardada');
        this.modalController.dismiss();
      })
      .catch((err) => {
        this.loadingController.dismiss();
        this.presentToast('Error al guardar la nota');
      })
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'loading',
      message: '',
      spinner: 'crescent'
    });
    await loading.present();
  }

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      cssClass: 'toast',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }

  public goBack(){
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
          cssClass:'delete',
          handler: () => {
            this.goBack();
          }
        }
      ]
    });

    await alert.present();
  }

}

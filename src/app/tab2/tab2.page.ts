import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Nota } from '../model/nota';
import { NotasService } from '../services/notas.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public tasks: FormGroup;

  constructor(private formBuilder: FormBuilder, private notasS: NotasService, public loadingController: LoadingController, public toastController: ToastController) {
    this.tasks = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['']
    })
  }

  public async sendForm() {
    await this.presentLoading();
    let data: Nota = {
      titulo: this.tasks.get('title').value,
      texto: this.tasks.get('description').value
    }
    this.notasS.agregaNota(data)
      .then((respuesta) => {
        this.tasks.setValue({
          title: '',
          description: ''
        })
        this.loadingController.dismiss();
        this.presentToast('Nota guardada');
      })
      .catch((err) => {
        this.loadingController.dismiss();
        this.presentToast('Error al guardar la nota');
      })
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
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

}

import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ServiciosService {

  constructor(private loadingController:LoadingController,
    private toastController: ToastController) { }

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'loading',
      message: '',
      spinner: 'crescent',
    });
    await loading.present();
  }

  stopLoading(){
    this.loadingController.dismiss();
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
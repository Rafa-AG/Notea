import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  constructor(private loadingController: LoadingController) { }

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

}

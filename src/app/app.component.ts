import { Component } from '@angular/core';

import { ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { FavoritosPage } from './pages/favoritos/favoritos.page';
import { AboutPage } from './pages/about/about.page';
import { Flashlight } from '@ionic-native/flashlight/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authS: AuthService,
    private modalController: ModalController,
    private flashlight:Flashlight) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.authS.ngOnInit();
    });
  }

  /**
   * Method to open About Page
   */
  public async about() {
    const modal = await this.modalController.create({
      component: AboutPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  /**
   * Method to open Favoritos Page
   */
  public async favoritos() {
    const modal = await this.modalController.create({
      component: FavoritosPage,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  public openFlashlight(){
    this.flashlight.switchOn().then((respuesta)=>{
      console.log(respuesta);
    }).catch((err)=>{
      console.log(err);
    })
  }

  public closeFlashlight(){
    this.flashlight.switchOff().then((res)=>{
      console.log(res)
    }).catch((err)=>{
      console.log(err)
    })
  }

}

import { Component } from '@angular/core';

import { ActionSheetController, ModalController, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { FavoritosPage } from './pages/favoritos/favoritos.page';
import { AboutPage } from './pages/about/about.page';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { TranslateService } from '@ngx-translate/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  private language: string;

  constructor(private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private authS: AuthService,
    private modalController: ModalController,
    private flashlight: Flashlight,
    private translateS: TranslateService,
    private actionSheetController: ActionSheetController,
    private nativeStorage: NativeStorage) {
    this.initializeApp();
  }

  initializeApp() {
    this.language = 'Español (España)'
    this.translateS.setDefaultLang('es');
    this.translateS.use('es');
    this.nativeStorage.getItem('lang').then((res) => {
      console.log(res.lang)
      this.language = res.lang
    }).catch((err) => {
      console.log(err)
    })
    this.nativeStorage.getItem('language').then((res) => {
      console.log(res.language)
      this.selectLanguage(res.language)
    }).catch((err) => {
      console.log(err)
    })

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

  public flash() {
    this.flashlight.toggle().then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err)
    })
  }

  async actionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Español (España)',
          icon: 'globe-outline',
          handler: () => {
            this.selectLanguage('es')
          }
        },
        {
          text: 'English (United Kingdom)',
          icon: 'globe-outline',
          handler: () => {
            this.selectLanguage('en');
          }
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          handler: () => {

          }
        }]
    });
    await actionSheet.present();
  }

  public selectLanguage(language: string) {
    if (language === 'es') {
      this.language = 'Español (España)'
    } else if (language === 'en') {
      this.language = 'English (United Kingdom)'
    }
    let lang = this.language
    this.translateS.use(language);
    this.nativeStorage.setItem('language', { language }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
    this.nativeStorage.setItem('lang', { lang }).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  }

}

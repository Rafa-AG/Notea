import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(private modalController: ModalController,
    private iab: InAppBrowser) { }

  //URL to developer Twitter account
  twitter: string = 'https://twitter.com/illofali';
  //URL to developer Instagram account
  instagram: string = 'https://www.instagram.com/illo.rafa/';

  ngOnInit() {
  }

  /**
   * Method to close Modal and come back to Tab1
   */
  public goBack() {
    this.modalController.dismiss();
  }

  /**
   * Method to open browser
   * @param url Link to open
   */
  public openWithCordovaBrowser(url: string) {
    let target = "_self";
    this.iab.create(url, target);
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { browser } from 'protractor';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(private router: Router,
    private modalController: ModalController,
    private loadingController: LoadingController,
    private iab: InAppBrowser) { }

  twitter:string='https://twitter.com/illofali';
  instagram:string='https://www.instagram.com/illo.rafa/';

  ngOnInit() {
  }

  public goBack() {
    this.modalController.dismiss();
  }

  public openWithCordovaBrowser(url:string){
    let target="_self";
    this.iab.create(url, target);
  }

}

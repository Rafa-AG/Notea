import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-codigoqr',
  templateUrl: './codigoqr.page.html',
  styleUrls: ['./codigoqr.page.scss'],
})
export class CodigoqrPage implements OnInit {

  constructor(private modalController: ModalController) { }

  ngOnInit() {
  }

  

  /**
   * Method to close Modal and come back to Tab1
   */
  public goBack() {
    this.modalController.dismiss();
  }

}

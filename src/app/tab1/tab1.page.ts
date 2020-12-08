import { Component, Input, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonSearchbar, LoadingController, MenuController, ModalController } from '@ionic/angular';
import { Nota } from '../model/nota';
import { EditNotaPage } from '../pages/edit-nota/edit-nota.page';
import { NotasService } from '../services/notas.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  @ViewChild('search', { static: false }) search: IonSearchbar;

  //Nota Array
  public listaNotas = [];
  //Aux object
  public items: any;

  constructor(private notasS: NotasService,
    private modalController: ModalController,
    private menu: MenuController,
    private alert: AlertController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController) { }

  /**
   * Method to call cargarColeccion() of NotasService and cargaDatos() when page is opened
   */
  ionViewDidEnter() {
    this.notasS.cargarColeccion();
    this.cargaDatos();
  }

  ngOnInit() {
    
  }

  /**
   * Method to get data from firebase and save it on listaNotas and items
   * @param $event 
   */
  public cargaDatos($event = null) {
    try {
      this.notasS.leeNotas()
        .subscribe((info: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
          this.listaNotas = [];
          info.forEach((doc) => {
            let nota = {
              id: doc.id,
              ...doc.data()
            }
            this.listaNotas.push(nota);
            this.items = this.listaNotas;
          });
          if ($event) {
            $event.target.complete();
          }
        })
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Method to delete Nota from firebare
   * @param id Nota key to delete
   */
  public borraNota(id: any) {
    this.notasS.borraNota(id).then(() => {
      let tmp = [];
      this.listaNotas.forEach((nota) => {
        if (nota.id != id) {
          tmp.push(nota);
        }
      })
      this.listaNotas = tmp;
      this.items = this.listaNotas;
    })
      .catch(err => {

      })
  }

  /**
   * Method to call EditNota Page
   * @param nota Nota to edit
   */
  public async editaNota(nota: Nota) {
    const modal = await this.modalController.create({
      component: EditNotaPage,
      cssClass: 'my-custom-class',
      componentProps: {
        nota: nota
      }
    });
    modal.present();

    return await modal.onDidDismiss().then((load) => {
      this.cargaDatos();
    })
  }

  /**
   * Method to open Menu
   */
  openFirt() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  /**
   * Method to show alert if user try to delete a note
   * @param id 
   */
  public async presentAlertConfirm(id: any) {
    const alert = await this.alert.create({
      cssClass: 'alertDelete',
      header: 'Borrado',
      message: '¿Está seguro de que quiere eliminar la nota?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel',
          handler: () => {
          }
        }, {
          text: 'Eliminar',
          cssClass:'delete',
          handler: () => {
            this.borraNota(id);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Method to search notes
   * @param ev Event to search
   */
  public searchItems(ev: any) {
    const val = ev.target.value;
    this.items = this.listaNotas;
    if (val && val.trim() !== '') {
      this.items = this.items.filter((item) => {
        return (item.titulo.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.texto.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  /**
   * Method to set note to favorite
   * @param nota Note setted favorite
   */
  public async setFavorito(nota: Nota) {
    await this.presentLoading();
    let data: Nota = {
      titulo: nota.titulo,
      texto: nota.texto,
      favorito: nota.favorito
    }
    this.notasS.actualizarNota(nota.id, data)
      .then((respuesta) => {
        this.loadingController.dismiss();
      }).catch((err) => {
        this.loadingController.dismiss();
      })
  }

  /**
   * Method to pause application a little time to load it
   */
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'loading',
      message: '',
      spinner: 'crescent',
    });
    await loading.present();
  }

  /**
   * Method to show menu with some options when user click on a note
   * @param nota Note clicked
   */
  async presentActionSheet(nota: Nota) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Favorito',
        icon: 'star',
        handler: () => {
          nota.favorito = true;
          this.setFavorito(nota);
        }
      }, {
        text: 'Cancelar',
        icon: 'close',
        role: 'cancel',
        handler: () => {

        }
      }]
    });
    await actionSheet.present();
  }

}
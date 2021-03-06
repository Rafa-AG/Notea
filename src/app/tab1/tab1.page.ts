import { Component, ViewChild } from '@angular/core';
import { ActionSheetController, AlertController, IonSearchbar, MenuController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Nota } from '../model/nota';
import { EditNotaPage } from '../pages/edit-nota/edit-nota.page';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';
import { ServiciosService } from '../services/servicios.service';

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

  private user = {
    id: 0,
    nombre: '',
    email: ''
  }

  constructor(private modalController: ModalController,
    private menu: MenuController,
    private alert: AlertController,
    private actionSheetController: ActionSheetController,
    private servicios: ServiciosService,
    private httpS: HttpService,
    private authS: AuthService,
    private translateS: TranslateService) { }

  /**
   * Method to call cargarColeccion() of NotasService and cargaDatos() when page is opened
   */
  ionViewDidEnter() {
    this.authS.cargaUsuarios();
    this.cargaDatos();
  }

  ngOnInit() {

  }

  /**
   * Method to get data from database and save it on listaNotas and items
   * @param $event 
   */
  public async cargaDatos($event = null) {
    try {
      await this.userLogged()
      this.httpS.getNotesByUser(this.user.id).then((res) => {
        let data = res.data;
        this.listaNotas = JSON.parse(data);
        this.items = this.listaNotas
        if ($event) {
          $event.target.complete();
        }
      })
    } catch (err) {
      console.log(err);
    }
  }

  async userLogged() {
    try {
      await this.httpS.getAllUsers().then((res) => {
        let tmp = []
        let data = res.data;
        data = JSON.parse(data);
        tmp = data;
        tmp.forEach((u) => {
          if (u.email === this.authS.user.email) {
            this.user = u;
          }
        })
      })
    } catch (err) {
      console.log(err)
    }
  }

  /**
   * Method to delete Nota from firebare
   * @param id Nota key to delete
   */
  public borraNota(id: any) {
    try {
      this.httpS.eliminarNota(id).then((res) => {
        let tmp = [];
        this.listaNotas.forEach((nota) => {
          if (nota.id != id) {
            tmp.push(nota);
          }
        })
        this.listaNotas = tmp;
        this.items = this.listaNotas;
      })
    } catch (err) {
      console.log(err)
    }
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
    try {
      let header, message, cancel, del;
      this.translateS.get('BORRADO').subscribe((res: string) => {
        header = res
      })
      this.translateS.get('CONFIRMACION BORRADO NOTA').subscribe((res: string) => {
        message = res
      })
      this.translateS.get('ELIMINAR').subscribe((res: string) => {
        del = res
      })
      this.translateS.get('CANCELAR').subscribe((res: string) => {
        cancel = res
      })
      const alert = await this.alert.create({
        cssClass: 'alertDelete',
        header: header,
        message: message,
        buttons: [
          {
            text: cancel,
            role: 'cancel',
            cssClass: 'cancel',
            handler: () => {
            }
          }, {
            text: del,
            cssClass: 'delete',
            handler: () => {
              this.borraNota(id);
            }
          }
        ]
      });
      await alert.present();
    } catch (err) {
      console.log(err)
    }
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
    await this.servicios.presentLoading();
    let data: Nota = {
      id: nota.id,
      titulo: nota.titulo,
      texto: nota.texto,
      favorito: nota.favorito
    }
    this.httpS.editarNota(data).then((res) => {
      this.servicios.stopLoading();
    }).catch((err) => {
      this.servicios.stopLoading();
      console.log(err)
    })
  }

  /**
   * Method to show menu with some options when user click on a note
   * @param nota Note clicked
   */
  async actionSheetPrincipal(nota: Nota) {
    try {
      let header, fav, cancel;
      this.translateS.get('OPCIONES').subscribe((res: string) => {
        header = res
      })
      this.translateS.get('FAVORITO').subscribe((res: string) => {
        fav = res
      })
      this.translateS.get('CANCELAR').subscribe((res: string) => {
        cancel = res
      })
      const actionSheet = await this.actionSheetController.create({
        header: header,
        cssClass: 'my-custom-class',
        buttons: [{
          text: fav,
          icon: 'star',
          handler: () => {
            nota.favorito = true;
            this.setFavorito(nota);
          }
        },
        {
          text: cancel,
          icon: 'close',
          role: 'cancel',
          handler: () => {

          }
        }]
      });
      await actionSheet.present();
    } catch (err) {
      console.log(err)
    }
  }

}
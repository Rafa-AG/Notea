import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { HttpService } from 'src/app/services/http.service';
import { NotasService } from 'src/app/services/notas.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  //Nota Array
  public listaFavoritos = [];

  private user = {
    id: 0,
    nombre: '',
    email: ''
  }

  constructor(private notasS: NotasService,
    private modalController: ModalController,
    private httpS: HttpService,
    private authS: AuthService) { }

  /**
   * Method to call cargaDatos() at init of page
   */
  ngOnInit() {
    this.cargaDatos();
  }

  /**
   * Method to get all note data from firebase and save it on listaFavoritos
   * @param $event 
   */
  public async cargaDatos($event = null) {
    try {
      await this.userLogged();
      this.httpS.getNotesByUser(this.user.id).then((res) => {
        let tmp = []
        let data = res.data;
        tmp = JSON.parse(data);
        tmp.forEach((n)=>{
          if(n.favorito==true){
            this.listaFavoritos.push(n);
          }
        })
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
   * Method to close Modal and come back to Tab1
   */
  public goBack() {
    this.modalController.dismiss();
  }

}

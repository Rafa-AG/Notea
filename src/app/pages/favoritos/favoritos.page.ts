import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NotasService } from 'src/app/services/notas.service';

@Component({
  selector: 'app-favoritos',
  templateUrl: './favoritos.page.html',
  styleUrls: ['./favoritos.page.scss'],
})
export class FavoritosPage implements OnInit {

  //Nota Array
  public listaFavoritos=[];

  constructor(private notasS:NotasService,
    private modalController:ModalController) { }

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
  public cargaDatos($event=null){
    try {
      this.notasS.leeNotas()
        .subscribe((info: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
          let items = [];
          info.forEach((doc) => {
            let nota = {
              id: doc.id,
              ...doc.data()
            }
            items.push(nota);
          });
          items.forEach((nota)=>{
            if(nota.favorito==true){
              this.listaFavoritos.push(nota);
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

  /**
   * Method to close Modal and come back to Tab1
   */
  public goBack(){
    this.modalController.dismiss();
  }

}

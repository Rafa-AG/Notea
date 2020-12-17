import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
import { NotasService } from 'src/app/services/notas.service';

@Component({
  selector: 'app-tab1ami',
  templateUrl: './tab1ami.page.html',
  styleUrls: ['./tab1ami.page.scss'],
})
export class Tab1amiPage implements OnInit {

  @ViewChild('search', { static: false }) search: IonSearchbar;

  private listaAmigos = [];
  private items: any;

  constructor(private notasS: NotasService) { }

  ngOnInit() {
    this.notasS.cargarColeccion();
    this.cargaDatos();
  }

  public cargaDatos($event = null) {
    try {
      this.notasS.leeNotas()
        .subscribe((info: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData>) => {
          this.listaAmigos = [];
          info.forEach((doc) => {
            let amigo = {
              ...doc.data()
            }
            this.listaAmigos.push(amigo);
            this.items = this.listaAmigos;
          });
          let tmp = [];
          this.listaAmigos.forEach((a) => {
            if (a.email != null) {
              tmp.push(a);
            }
          })
          this.listaAmigos = tmp;
          this.items = this.listaAmigos;
          if ($event) {
            $event.target.complete();
          }
        })
    } catch (err) {
      console.log(err);
    }
  }

  public searchItems(ev: any) {
    const val = ev.target.value;
    this.items = this.listaAmigos;
    if (val && val.trim() !== '') {
      this.items = this.items.filter((item) => {
        return (item.nombre.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

}

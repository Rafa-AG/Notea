import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Nota } from '../model/nota';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';
import { LoadingService } from '../services/loading.service';
import { NotasService } from '../services/notas.service';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public tasks: FormGroup;

  private user = {
    id: 0,
    nombre: '',
    email: ''
  }

  constructor(private formBuilder: FormBuilder,
    private notasS: NotasService,
    private loadingS: LoadingService,
    private toastS: ToastService,
    private httpS: HttpService,
    private authS: AuthService) {
    this.tasks = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['']
    })
  }

  ionViewDidEnter() {
    this.authS.cargaUsuarios();
    this.userLogged();
  }

  /**
   * Method to call agregaNota() from Notas Service
   */
  public async sendForm() {
    try {
      await this.loadingS.presentLoading();
      let data: Nota = {
        titulo: this.tasks.get('title').value,
        texto: this.tasks.get('description').value,
        id_usuario: this.user.id
      }
      this.notasS.agregaNota(data).then((respuesta) => {
          this.tasks.setValue({
            title: '',
            description: ''
          })
          this.httpS.insertarNota(data).then((res)=>{
            console.log(res)
          })
          this.loadingS.stopLoading();
          this.toastS.presentToast('Nota guardada');
        })
    } catch (err) {
      this.loadingS.stopLoading();
      this.toastS.presentToast('Error al guardar la nota');
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

}
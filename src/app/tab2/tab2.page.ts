import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { Nota } from '../model/nota';
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

  constructor(private formBuilder: FormBuilder, 
    private notasS: NotasService,
    private loadingS:LoadingService,
    private toastS:ToastService) {
    this.tasks = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['']
    })
  }

  /**
   * Method to call agregaNota() from Notas Service
   */
  public async sendForm() {
    await this.loadingS.presentLoading();
    let data: Nota = {
      titulo: this.tasks.get('title').value,
      texto: this.tasks.get('description').value
    }
    this.notasS.agregaNota(data)
      .then((respuesta) => {
        this.tasks.setValue({
          title: '',
          description: ''
        })
        this.loadingS.stopLoading();
        this.toastS.presentToast('Nota guardada');
      })
      .catch((err) => {
        this.loadingS.stopLoading();
        this.toastS.presentToast('Error al guardar la nota');
      })
  }

}
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor(private authS: AuthService,
    private router: Router,
    private nativeStorage: NativeStorage) { }

  public perfil={
    token:-1,
    name:'',
    avatar:''
  }

  ionViewWillEnter(){
    this.perfil={
      token:this.authS.user.token,
      name:this.authS.user.name,
      avatar:this.authS.user.avatar
    }
  }

  public async logout() {
    await this.authS.logout();
    if (!this.authS.isLogged()) {
      this.router.navigate(['/login']);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private google: GooglePlus,
    private authS: AuthService,
    private router: Router) { }

  /**
   * Method to go to Tab1 if user is logged at init of app
   */
  ngOnInit() {
    if (this.authS.isLogged()) {
      this.router.navigate(['/']);
    }
  }

  /**
   * Method to go to Tab1 when user have been logged 
   */
  public async login() {
    let u = await this.authS.login();
    if (u.token != -1) {
      this.router.navigate(['/']);
    }
  }

}
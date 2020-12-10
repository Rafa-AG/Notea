import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit, CanActivate{

  //Usuario without values
  public user:Usuario = {
    token: -1,
    name: '',
    avatar: '',
    email: ''
  }

  constructor(private storage: NativeStorage,
    private google: GooglePlus,
    private router: Router) { }

  /**
   * Method to get values of user with Native Storage at init of application
   */
  async ngOnInit() {
    let u = null;
    try {
      u = await this.storage.getItem('user');
    } catch (err) {
      u = null;
    }
    if (u != null) {
      this.user = u;
    }
  }

  /**
   * Method to check if user is logged
   */
  public isLogged(): boolean {
    if (this.user.token == -1) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Method to log out with app
   */
  public logout() {
    let u = this.google.logout();
    this.user = {
      token: -1,
      name: '',
      avatar: '',
      email:''
    }
    this.storage.setItem('user', this.user);
  }

  /**
   * Method to log in into app
   */
  public async login() {
    try {
      let u = await this.google.login({})
      if (u) {
        this.user = {
          token: u['accessToken'],
          name: u['displayName'],
          avatar: u['imageUrl'],
          email:u['email']
        }
      }
    } catch (err) {
      this.user = {
        token: -1,
        name: '',
        avatar: '',
        email:''
      }
      console.log(err);
    }
    await this.storage.setItem('user', this.user)
    return this.user;
  }

  /**
   * Method to come to Log In if user is not logged
   */
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.isLogged()) {
      this.router.navigate(["/login"]);
      return false;
    }
    return true;
  }

}

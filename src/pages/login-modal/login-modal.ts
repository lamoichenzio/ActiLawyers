import { Platform } from 'ionic-angular';
import { AlertController, ToastController, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login-modal',
  templateUrl: 'login-modal.html',
})
export class LoginModalPage {

  
  public userName;
  public status;
  public password = new String;


  constructor(public navCtrl: NavController, public platform: Platform, public navParams: NavParams, public viewCtrl: ViewController) {
  }


  selectUser() {

   // to do
  }

  loginButton() {

    // to do
  }

  

}

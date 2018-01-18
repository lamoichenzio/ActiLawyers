import { GlobalVar } from './../../app/global';
import { HTTP } from '@ionic-native/http';
import { Platform } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { AlertController, ToastController, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-login-modal',
  templateUrl: 'login-modal.html',
})
export class LoginModalPage {

  public users = [];
  public selectedUser = { id: 0, name: "Seleziona un utente" };
  public userName;
  public status;
  public password = new String;
  public backButtonUnregister: any;

  constructor(public navCtrl: NavController, public platform: Platform, public navParams: NavParams, public viewCtrl: ViewController, public nativeStorage: NativeStorage, public alertCtrl: AlertController, public toastCtrl: ToastController, public http: HTTP) {

    console.log(GlobalVar.serverUrl);
    this.backButtonUnregister = platform.registerBackButtonAction(() => { });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  // SELECT USER AND SET IN PLACEHOLDER
  selectUser() {
    console.log(GlobalVar.serverUrl);

    this.http.get(GlobalVar.serverUrl + 'users', {}, {})
      .then(
      data => {

        this.getUsers();
      },
      error => {

        let alert = this.alertCtrl.create();
        alert.setTitle('Errore');

        alert.setMessage("Non sei connesso alla rete interna")

        alert.addButton('Chiudi');
        alert.present();

      },

    );



  }

  // LOGIN FUNCTION
  loginButton() {
    console.log(GlobalVar.serverUrl);

    console.log("user: " + this.selectedUser.id + "---- password: " + this.password);
    var url = GlobalVar.serverUrl + 'login?userId=' + this.selectedUser.id + '&password=' + this.password;
    this.http.get(encodeURI(url), {}, {})
      .then(
      data => {
        console.log(data);
        var json = $.parseJSON(data.data);
        if (!json.error) {
          this.nativeStorage.setItem('user', json.data)
            .then(
            data => {
              this.nativeStorage.setItem('loginStatus', { isLogged: true })
                .then(
                data => {
                  console.log("Logged in");
                  this.viewCtrl.dismiss(this.selectedUser, this.status);
                },
                error => console.log("Save status:" + error)
                );
            });
        }
        else {
          let toast = this.toastCtrl.create({
            message: 'Password errata',
            duration: 3000
          });
          toast.present();
        }
      },
      error => {
        let toast = this.toastCtrl.create({
          message: 'Devi essere connesso alla rete dello studio per effettuare il login',
          duration: 3000
        });
        toast.present();
      },
    )
    this.viewCtrl.dismiss;

  }

  // DISABLE BACK BUTTON FOR MODAL LOGIN
  ionViewWillLeave() {
    this.backButtonUnregister();

  }

  initializeUsers() {

    this.users = [];

    // GET USERS LIST FOR LOGIN FROM SERVER
    this.nativeStorage.getItem('usersList')
      .then(
      data => {
        console.log(data);
        for (var index = 0; index < data.array.data.length; index++) {
          this.users.push(
            { 'id': data.array.data[index].lwy_ID, 'name': data.array.data[index].lwy_description }
          )
        }
        console.log(this.users);
        this.openAlertSelector();
      },
      error => {
        console.log(error);
      },
    );

  }

  getUsers() {
    console.log(GlobalVar.serverUrl);
    this.http.get(GlobalVar.serverUrl + 'users', {}, {})
      .then(
      data => {
        var usersList = $.parseJSON(data.data);
        this.nativeStorage.setItem('usersList', { array: usersList })
          .then(
          data => {
            this.initializeUsers();
          },
          error => console.log(error),
        );
      },
      error => {
        let toast = this.toastCtrl.create({
          message: 'Errore di rete',
          duration: 3000
        });
        toast.present();
      },
    );

  }

  openAlertSelector() {

    let alert = this.alertCtrl.create();
    alert.setTitle('Utenti');

    this.users.forEach(user => {
      alert.addInput({
        type: 'radio',
        label: user.name,
        value: user
      });
    });

    alert.addButton('Annulla');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        console.log(data);
        this.selectedUser = data;
      }
    });
    alert.present();
  }


  changeIpAlert(){

    let alert = this.alertCtrl.create({
      title: 'Imposta IP server',
      inputs: [
        {
          id: "ip",
          name: 'ip',
          placeholder: 'ip'
        },
        {
          id: "port",
          name: 'port',
          placeholder: 'port',
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Imposta',
          handler: data => {

            var address = "http://"+data.ip+":"+data.port+"/";
            GlobalVar.serverUrl = address;

            this.nativeStorage.setItem('ipServer', address)
              .then(
              data => {
                console.log("serverIp Stored");
              });

            console.log("IP server changed --- "+ address);
          }
        }
      ]
    });
    alert.present();
  
  }

}

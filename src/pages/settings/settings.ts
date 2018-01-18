import { File } from '@ionic-native/file';
import { NativeStorage } from '@ionic-native/native-storage';
import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage {

  public alertDelete;
  public alertLogout;
  constructor(public navCtrl: NavController, public nativeStorage: NativeStorage,public platform: Platform, public file: File, public alertCtrl: AlertController, public modalCtrl: ModalController) { }

  // DELETE FUNCTION
  buttonDelete() {
    var result;
    this.nativeStorage.remove('events')
    .then(
      data => console.log('events deleted'),
      error => console.log(error)
    );

    this.nativeStorage.remove('paperworks')
    .then(
      data => console.log('paperworks deleted'),
      error => console.log(error)
    );
    if(this.platform.is("android")){
    this.file.checkDir(this.file.externalApplicationStorageDirectory, 'documents/')
      .then(
      data => {
        this.file.removeRecursively(this.file.externalApplicationStorageDirectory, 'documents/')
          .then(
          data => {
            result = "deleted";
            this.initAlertDelete(result);
            this.presentAlertDelete();
          },
          error => {
            result = "undeleted";
            this.initAlertDelete(result);
            this.presentAlertDelete();
          },
        )
      },
      error => {
        result = "nodirectory";
        this.initAlertDelete(result);
        this.presentAlertDelete();
      },
    )
  }
  if(this.platform.is("ios")){
    this.file.checkDir(this.file.dataDirectory, 'documents/')
      .then(
      data => {
        this.file.removeRecursively(this.file.dataDirectory, 'documents/')
          .then(
          data => {
            result = "deleted";
            this.initAlertDelete(result);
            this.presentAlertDelete();
          },
          error => {
            result = "undeleted";
            this.initAlertDelete(result);
            this.presentAlertDelete();
          },
        )
      },
      error => {
        result = "nodirectory";
        this.initAlertDelete(result);
        this.presentAlertDelete();
      },
    )
  }

  }

  deleteData() {
    this.nativeStorage.remove('events')
    .then(
      data => console.log('events deleted'),
      error => console.log(error)
    );
    this.nativeStorage.remove('paperworks')
    .then(
      data => console.log('paperworks deleted'),
      error => console.log(error)
    );
    if(this.platform.is("android")){
    this.file.checkDir(this.file.externalApplicationStorageDirectory, 'documents/')
      .then(
      data => {
        this.file.removeRecursively(this.file.externalApplicationStorageDirectory, 'documents/')
          .then(
          data => console.log("documents deleted"),
          error => console.log(error),
        )
      },
      error => console.log(error),
    )
  }
    if (this.platform.is("ios")) {
      this.file.checkDir(this.file.dataDirectory, 'documents/')
        .then(
        data => {
          this.file.removeRecursively(this.file.dataDirectory, 'documents/')
            .then(
            data => console.log("documents deleted"),
            error => console.log(error),
          )
        },
        error => console.log(error),
      )
    }
  }


  // LOGOUT FUNCTION
  logout() {

    this.initAlertLogout();
    
    // call delete function
    this.deleteData();

    // set loging status to false
    this.nativeStorage.setItem('loginStatus', { isLogged: false })
      .then(
      data => {
        this.login();
      },
      error => console.log(error),
    );

  }

  // -- start ALERT FOR DELETE
  initAlertDelete(result) {

    if (result == "deleted") {
      this.alertDelete = this.alertCtrl.create({
        subTitle: 'Dati eliminati',
        buttons: ['Ok']
      });
    }
    if (result == "undeleted") {
      this.alertDelete = this.alertCtrl.create({
        subTitle: 'Errore duranre l\'eliminazione dei documenti',
        buttons: ['Ok']
      });
    }
    if (result == "nodirectory") {
      this.alertDelete = this.alertCtrl.create({
        subTitle: 'Non ci sono documenti da eliminare',
        buttons: ['Ok']
      });
    }

  }

  presentAlertDelete() {

    this.alertDelete.present();

  }
  // -- end ALERT FOR DELETE

  // -- start ALERT FOR LOGOUT
  initAlertLogout() {

    this.alertLogout = this.alertCtrl.create({
      subTitle: 'Logout effettuato',
      buttons: ['Ok']
    });

  }

  presentAlertLogout() {

    this.alertLogout.present();

  }
  // -- end ALERT FOR LOGOUT


  // OPEN LOGIN MODAL
  login() {
  
        var modalPage = this.modalCtrl.create('LoginModalPage', null, { enableBackdropDismiss: false });
        modalPage.present();
    
      }

}

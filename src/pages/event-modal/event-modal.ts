import { NativeStorage } from '@ionic-native/native-storage';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import * as moment from 'moment';
import 'moment/locale/it';

@IonicPage()
@Component({
  selector: 'page-event-modal',
  templateUrl: 'event-modal.html',
})
export class EventModalPage {

  public loader;
  public paperwork_json;
  public result: any = {};

  constructor(public navCtrl: NavController, public navParams: NavParams,public loaderCtrl: LoadingController, public viewCtrl: ViewController, public nativeStorage: NativeStorage, public modalCtrl: ModalController) {

    // SET VALUES OF EVENT MODAL
    this.initLoader();
    this.presentLoader();
    var value = [];
    nativeStorage.getItem('events')
      .then(
      data => {
        value = data.array.data[navParams.get('index')];
        moment.locale('it');
        this.result = {
          description: value['description'],
          start: moment(value['start']).format("dddd DD-MM-YYYY h:mm:ss"),
          ending: moment(value['ending']).format("dddd DD-MM-YYYY h:mm:ss")
        };
        
        this.paperwork_json = value['paperwork_json'];
        if (value['paperwork_json'] != undefined) {
          $("#paperwork").removeAttr("disabled");
        }
        this.closeLoader();
      },
      error => {this.closeLoader();
        console.log(error);},
      );
    
  }

  // OPEN PAPERWORK PAGE 
  openPaperwork() {

    this.navCtrl.push('PaperworkItemPage', { paperwork: this.paperwork_json });
  };

  // -- start LOADER
  initLoader() {
    this.loader = this.loaderCtrl.create({
      content: "Caricamento",
    });
  };

  presentLoader() {
    this.loader.present();
  };
  
  closeLoader() {
    this.loader.dismiss().catch(() => {});
  }
  // -- end LOADER

}

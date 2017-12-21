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
  public pratica_json;
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
          descrizione: value['descrizione'],
          inizio: moment(value['inizio']).format("dddd DD-MM-YYYY h:mm:ss"),
          fine: moment(value['fine']).format("dddd DD-MM-YYYY h:mm:ss")
        };
        
        this.pratica_json = value['pratica_json'];
        if (value['pratica_json'] != undefined) {
          $("#pratica").removeAttr("disabled");
        }
        this.closeLoader();
      },
      error => {this.closeLoader();
        console.log(error);},
      );
    
  }

  // OPEN PAPERWORK PAGE 
  openPaperwork() {

    this.navCtrl.push('PaperworkItemPage', { pratica: this.pratica_json });
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

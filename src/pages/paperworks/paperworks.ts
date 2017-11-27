import { NativeStorage } from '@ionic-native/native-storage';
import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

@Component({
  selector: 'page-paperworks',
  templateUrl: 'paperworks.html'
})

export class PaperworksPage {

  public paperworks = [];

  constructor(public navCtrl: NavController, public nativeStorage: NativeStorage, public viewCtrl: ViewController, public spinnerCtrl: SpinnerDialog) { }

  // RELOAD PAPERWORKS LIST
  ionViewDidEnter() {

    $('#spinner').removeClass('hidden');
    this.paperworks = [];
    this.initilizePaperworks();

  }

  // OPEN PAPERWORKS VIEW
  openPaperwork(data) {
    var paperwork_json = this.paperworks[data]['paperwork_json'];
    this.navCtrl.push('PaperworkItemPage', { paperwork: paperwork_json });
  }

  // SET PAPERWORKS LIST
  initilizePaperworks() {

    this.paperworks= [];
    this.nativeStorage.getItem("paperworks")
      .then(
      data => {
        for (var index = 0; index < data.array.data.length; index++) {
          this.paperworks.push(
            { paperwork_json: data.array.data[index] }
          );
        }
        console.log(this.paperworks);
        $('#spinner').addClass('hidden');
        // this.spinnerCtrl.hide();
      },
      error => {
        console.log(error);
        $('#spinner').addClass('hidden');
        // this.spinnerCtrl.hide();
      },
    )

  }

  // SERACHBAR FOR PAPERWORKS
  getPaperworks(ev: any) {
    
    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.paperworks = this.paperworks.filter((paper) => {
        return (paper.paperwork_json.paperwork.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
  onCancel(ev: any) {
    this.initilizePaperworks();
  }

}

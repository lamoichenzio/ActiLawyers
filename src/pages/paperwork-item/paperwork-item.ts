import { GlobalVar } from './../../app/global';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { NativeStorage } from '@ionic-native/native-storage';
import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams, Platform, ViewController, ToastController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-paperwork-item',
  templateUrl: 'paperwork-item.html',
})

export class PaperworkItemPage {
  @ViewChild(Slides) slides: Slides;

  public value;
  public documents = [];
  public documentsDownloaded = [];
  public result: any = {};
  public peopleArray = [];
  public downloadLoader;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public viewCtrl: ViewController, public nativeStorage: NativeStorage, public platform: Platform, public fileCtrl: File, public fileOpener: FileOpener, public transfer: FileTransfer) {

    this.value = navParams.get('paperwork');

    // SET DEFAOULT VALUE IF VALUE IS UNDEFINED
    if (this.value.type == null) { this.value.type = "Non definito"; };
    if (this.value.lawyer.surname == null) { this.value.lawyer.surname = "Non definito"; };
    if (this.value.creation_date == null) { this.value.creation_date = "Non definito"; };
    if (this.value.court_office_name == null) { this.value.court_office_name = "Non definito"; };
    if (this.value.last_change == null) { this.value.last_change = "Non definito"; };
    if (this.value.description == null) { this.value.description = "Non definito"; };
    if (this.value.role == null) { this.value.role = "Non definito"; };
    if (this.value.procedura == null) { this.value.procedura = "Non definito"; };
    if (this.value.istructor == null) { this.value.istructor = "Non definito"; };
    if (this.value.topic == null) { this.value.topic = "Non definito"; };
    if (this.value.client_role == null) { this.value.client_role = "Non definito"; };
    if (this.value.paperwork == null) { this.value.paperwork = "Non definito"; };

    // SET PAPERWORKS PLACEHOLDER
    this.result = {
      type: this.value.type,
      lawyer: this.value.lawyer.surname,
      creation_date: this.value.creation_date,
      court_office_name: this.value.court_office_name,
      last_change: this.value.last_change,
      description: this.value.description,
      role: this.value.role,
      procedura: this.value.procedura,
      istructor: this.value.istructor,
      topic: this.value.topic,
      client_role: this.value.client_role,
      paperwork: this.value.paperwork
    };

    // SET DOCUMENTS PLACEHOLDER
    this.documents = this.value.documents;

    // CHECK AVAIBLE DOWNLOAD
    this.fileCtrl.checkDir(this.fileCtrl.externalApplicationStorageDirectory, 'documents/' + this.value.id)
      .then(
      _ => {
        console.log(this.value['documents']);
        $('#download-button').addClass('hidden');
        $('#no-documents').addClass('hidden');
        console.log('Directory exists');
        this.fileCtrl.listDir(this.fileCtrl.externalApplicationStorageDirectory, 'documents/' + this.value.id)
          .then(
          data => {
            for (var index = 0; index < data.length; index++) {
              this.documentsDownloaded.push(
                { 'name': data[index].name, 'path': data[index].nativeURL },
              );
            }
          }
          )
        console.log(this.value['documents']);
      }
      )
      .catch(
      err => {
        console.log('Directory doesnt exist');
        if (this.value.documents[0] == undefined) {
          $('#already-downloaded').addClass('hidden');
          $('#no-documents').removeClass("hidden");
          $('#download-button').addClass('hidden');
        }
        else {
          $('#already-downloaded').addClass('hidden');
          $('#no-documents').addClass("hidden");
          $('#download-button').removeClass('hidden');
        }
      }
      );

    for (var index = 0; index < this.value['people'].length; index++) {
      this.peopleArray.push(this.value['people'][index]);
    }

    console.log(this.peopleArray);

  }

  public closeModal() {
    this.navCtrl.pop();
  }

  // --start SLIDER
  paperSlide() {
    this.slides.slideTo(0, 300);
  }

  peopleSlide() {
    this.slides.slideTo(1, 300);
  }

  documentsSlide() {
    this.slides.slideTo(2, 300);
  }
  // -- end SLIDER

  // OPEN DOCUMENT FORM INDEX i
  openDocuments(i) {

    console.log(this.documents[i]);

    var fileName = this.documents[i].name;
    var fileUrl = this.fileCtrl.externalApplicationStorageDirectory + 'documents/' + this.value.id + '/';
    var type = this.documents[i].name.split('.').pop();

    console.log(fileUrl + fileName);

    let MIMETypes = {
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'bmp': 'image/bmp',
      'png': 'image/png',
      'eml': 'application/eml',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf': 'application/rtf',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    }

    var fileMIMEType = MIMETypes[type];

    console.log(fileMIMEType);

    this.fileOpener.open(fileUrl + fileName, fileMIMEType)
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error openening file', e));

  }

  // DOWNLOAD DOCUMENTS
  downloadDocument() {

    this.initDownloadLoader();
    this.presentDownloadLoader();

    this.value.documents.forEach(document => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      const url = GlobalVar.serverUrl + "file?id=" + document.id;
      fileTransfer.download(url, this.fileCtrl.externalApplicationStorageDirectory + '/documents/' + this.value.id + '/' + document.name)
        .then(
        (entry) => {
          $('#already-downloaded').removeClass('hidden');
          $('#download-button').addClass('hidden');
          $('#no-documents').addClass('hidden');
          this.closeDownloadLoader();
        }, (error) => {

          this.closeDownloadLoader();
          let toast = this.toastCtrl.create({
            message: 'Errore di rete',
            duration: 3000
          });
          toast.present();
          console.log(error);
        })
        .catch(
        error => {
          console.log(error);
          this.closeDownloadLoader();
          let toast = this.toastCtrl.create({
            message: 'Errore di rete',
            duration: 3000
          });
          toast.present();
        },
      );
    });

  }

  // -- start DOWNLOAD LOADER
  initDownloadLoader() {
    this.downloadLoader = this.loadingCtrl.create({
      content: "Caricamento",
    });
  };
  presentDownloadLoader() {
    this.downloadLoader.present()
  };
  closeDownloadLoader() {
    this.downloadLoader.dismiss();
  }
  // -- end DOWNLOAD LOADER


  show(i) {

    if ($('#lista' + i).is(":visible")) {
      $('#lista' + i).addClass('hidden');
      document.getElementById('#arrow' + i).setAttribute('name', 'arrow-dropdown')
    }
    else {
      $('#lista' + i).removeClass('hidden');
      document.getElementById('#arrow' + i).setAttribute('name', 'arrow-dropright')

    }
  }
}

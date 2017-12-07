import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, Platform, ToastController, ViewController } from 'ionic-angular';
import { NativeStorage } from '@ionic-native/native-storage';
import { HTTP } from '@ionic-native/http';
import { ModalController } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import * as moment from 'moment';
import { GlobalVar } from '../../app/global';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})

export class CalendarPage {

public pratica;

  public idUser;
  public startLoader;
  public loader;
  public feeds;
  public myDate;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public nativeStorage: NativeStorage, public loadingCtrl: LoadingController, public http: HTTP, public alertCtrl: AlertController, public toastCtrl: ToastController, public platform: Platform, public datePicker: DatePicker, public transfer: FileTransfer, public file: File, public viewCtrl: ViewController) {

    $(document).ready(function () {

      // CCALENDAR BUTTON
      $('#prev').click(function () {
        $('#calendar').fullCalendar('prev');
      });

      $('#next').click(function () {
        $('#calendar').fullCalendar('next');
      });

      // DISPLAY CALENDAR

      $('#calendar').fullCalendar({
        locale: "it",
        themeSystem: 'bootstrap3',
        showNonCurrentDates: false,
        aspectRatio: 0.88,
        firstDay: 1,
        defaultView: 'listWeek',
        eventLimitClick: 'listWeek',
        header: {
          left: 'title',
          center: '',
          right: ''
        },
        eventLimit: true,
        eventClick: function (event) {
          navCtrl.push('EventModalPage', { id: event.id, index: event.index });
        }
      });
    });

  }

  syncButton() {

    this.sync();

  }

  sync() {

    this.initLoader();
    this.presentLoader();
    this.saveDates();

  }

  login() {

    var modalPage = this.modalCtrl.create('LoginModalPage', null, { enableBackdropDismiss: false });
    modalPage.present();

  }

  // SAVE EVENTS AND PAPERWORKS IN APP INTERNAL DATA
  saveDates() {

    this.nativeStorage.getItem('user')
      .then(
      data => {
        this.idUser = data.ope_ID;

        // SAVE EVENTS
        this.http.get(GlobalVar.serverUrl + 'notes?userId=' + this.idUser, {}, {})
          .then(data => {
            var eventsData = $.parseJSON(data.data);
            this.nativeStorage.setItem('events', { array: eventsData })
              .then(
              data => {
                console.log(data);
              },
              error => {
                console.log("Error in save Dates:" + error);
              }
              )
              .catch(
              error => console.log(error),
            );
            this.reloadEvents();
          },
          error => {
            let toast = this.toastCtrl.create({
              message: 'Errore di rete',
              duration: 3000
            });
            this.closeLoader();
            toast.present();
          }
          )
          .catch(
          error => console.log(error),
        );
      },
    );

    // SAVE PAPERWORKS
    this.http.get(GlobalVar.serverUrl + 'paperworks', {}, {})
      .then(
      data => {
        var paperworksData = $.parseJSON(data.data);
        this.pratica = paperworksData[508];
        this.nativeStorage.setItem('paperworks', { array: paperworksData })
          .then(
          data => console.log(paperworksData),
        )
          .catch(
          error => console.log(error),
        );
      },
      error => {
        console.log(error);
      })
      .catch(
      error => console.log(error),
    );
  }

  // RELOAD EVENTS IN FULLCALENDAR PLUGIN
  reloadEvents() {
    this.nativeStorage.getItem('events')
      .then(
      data => {
        var newEvents = new Array();
        for (var index = 0; index < data.array.data.length; index++) {
          newEvents.push(
            { id: data.array.data[index].id, title: data.array.data[index].descrizione, start: moment(data.array.data[index].inizio), index: index }
          );
        };
        $('#calendar').fullCalendar('removeEvents');
        $('#calendar').fullCalendar('addEventSource', newEvents);
        console.log("debug 22");
        this.downloadDocumentsOfWeek();
      },
      error => {
        console.log(error);
      },
    )
      .catch(
      error => console.log(error),
    );
  }

  // JUMP TO SPECIFIC DATE IN FULLCALENDAR
  goToDate() {
    var temp = moment(this.myDate);
    if (temp != undefined) {
      $('#calendar').fullCalendar('gotoDate', temp);
    };    
  }

  // -- begin LOADER
  initLoader() {

    this.loader = this.loadingCtrl.create({
      content: "Sincronizzazione...",
    });

  }

  presentLoader() {

    this.loader.present();

  }

  closeLoader() {

    this.loader.dismiss().catch(() => { });

  }
  // -- end LOADER

  // -- begin START LOADER
  initStartLoader() {

    this.startLoader = this.loadingCtrl.create({
      content: "Caricamento",
    });

  }

  presentStartLoader() {

    this.startLoader.present();

  }

  closeStartLoader() {

    this.startLoader.dismiss().catch(() => { });

  }
  // -- end STARTLOADER

  downloadDocumentsOfWeek() {

    this.file.removeRecursively(this.file.externalApplicationStorageDirectory, 'documents/')
      .then(
      data => { console.log("data deleted") },
      error => console.log(error),
    );

    // CREATE CURRENT WEEK
    var startOfWeek = moment().startOf('isoWeek');
    var endOfWeek = moment().endOf('isoWeek');
    var days = [];
    var dayyy = startOfWeek;

    while (dayyy <= endOfWeek) {
      days.push(dayyy.toDate());
      dayyy = dayyy.clone().add(1, 'd');
    }

    // CHECK IF EVENTS ARE IN CURRENT WEEK
    this.nativeStorage.getItem('events')
      .then(
      data => {
        // TAKE AT MOST LAST 100 EVENTS
        var cont = 100;
        var arraySection = data.array.data;
        if (arraySection.length <= 100) {
          cont = arraySection.length;
        };

        // COUNTER FOR END SYNC LOADER
        var contEvents = 0;
        var tempEvents = 0;

        // CHECK AND DOWNLOAD DOCUMENTS OF EVENTS IN CURRENT WEEK
        for (var index = 0; index < cont; index++) {

          var current = moment(arraySection[index].inizio);
          var pratica = arraySection[index].paperwork_json;

          days.forEach(dayyy => {

            var index = moment(dayyy).get('year') + "-" + moment(dayyy).get('month') + "-" + moment(dayyy).get('day');
            var currentDay = current.get('year') + "-" + current.get('month') + "-" + current.get('day');

            if (index == currentDay) {
              if (pratica != undefined) {
                if (pratica.documents != undefined) {
                  pratica.documents.forEach(document => {
                    contEvents++;
                  });
                }
              }
            }

            if (index == currentDay) {
              if (pratica != undefined) {
                if (pratica.documents != undefined) {

                  pratica.documents.forEach(document => {
                    const fileTransfer: FileTransferObject = this.transfer.create();
                    const url = GlobalVar.serverUrl + 'file?id=' + document.id;
                    fileTransfer.download(url, this.file.externalApplicationStorageDirectory + 'documents/' + pratica.id + '/' + document.name)
                      .then(

                      (entry) => {
                        console.log('download complete: ' + entry.toURL());
                        tempEvents++;

                        if (tempEvents == contEvents) {
                          this.closeLoader();
                        }
                      },
                      (error) => {
                        console.log(error);
                        this.closeLoader();
                      }).catch(
                      error => console.log(error),
                    );
                  });

                }
              }
            }
          });
          if (tempEvents == contEvents) {
            this.closeLoader();
          }
        }
      },
      error => {
        console.log(error);
        this.closeLoader();
      }
      )
      .catch(
      error => console.log(error),
    );
  }

  ionViewDidEnter() {

    this.initStartLoader();
    this.presentStartLoader();

    this.platform.ready()
      .then(

      () => {

        // LOAD USERS
        this.nativeStorage.getItem('loginStatus')
        .then(
        data => {
          if (!data["isLogged"]) {
            this.login();
          }
        },
        error => this.login()
        );

        // LOAD EVENTS
        this.nativeStorage.getItem("events")
          .then(

          data => {
            console.log(data);
            var newEvents = new Array();
            for (var index = 0; index < data.array.data.length; index++) {
              newEvents.push(
                { id: data.array.data[index].id, title: data.array.data[index].descrizione, start: moment(data.array.data[index].inizio), index: index }
              );
            };
            $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar('addEventSource', newEvents);
            this.closeStartLoader();
          },
          error => {
            $('#calendar').fullCalendar('removeEvents');
            console.log(error);
            this.closeStartLoader();
          },
        )




      },

    );

  }

}



import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, Platform, ToastController, ViewController } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import * as moment from 'moment';
import { GlobalVar } from '../../app/global';

@Component({
  selector: 'page-calendar',
  templateUrl: 'calendar.html'
})

export class CalendarPage {

public pratica;

  public loader;
  public myDate;

  constructor(public navCtrl: NavController, public platform: Platform, public loaderCtrl: LoadingController, public viewCtrl: ViewController) {

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
        // eventClick: function (event) {
        //   navCtrl.push('EventModalPage', {});
        // }
      });
    });

  }

  syncButton() {

    // to do

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

    this.loader = this.loaderCtrl.create({
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



  

  

}



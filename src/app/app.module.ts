import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { PaperworksPage } from './../pages/paperworks/paperworks';
import { SettingsPage } from './../pages/settings/settings';
import { CalendarPage } from './../pages/calendar/calendar';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { NativeStorage } from '@ionic-native/native-storage';
import { HTTP } from '@ionic-native/http';
import { HttpModule } from '@angular/http';


import { DatePicker } from '@ionic-native/date-picker';

import { SpinnerDialog } from '@ionic-native/spinner-dialog';


@NgModule({
  declarations: [
    MyApp,
    PaperworksPage,
    SettingsPage,
    CalendarPage,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,  
    IonicModule.forRoot(MyApp, {
    monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre' ],}),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PaperworksPage,
    SettingsPage,
    CalendarPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    FileOpener,
    FileTransfer, 
    FileTransferObject,
    NativeStorage,
    SpinnerDialog,
    HTTP,
    DatePicker,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
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

import { HttpModule } from '@angular/http';


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
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

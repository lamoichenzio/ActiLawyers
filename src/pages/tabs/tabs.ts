import { Component } from '@angular/core';

import { PaperworksPage } from '../paperworks/paperworks';
import { SettingsPage } from '../settings/settings';
import { CalendarPage } from './../calendar/calendar';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = CalendarPage;
  tab2Root = PaperworksPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}

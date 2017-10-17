import { Component } from '@angular/core';

import { PaperworksPage } from '../paperworks/paperworks';
import { SettingsPage } from '../settings/settings';
import { EventsPage } from '../events/events';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = EventsPage;
  tab2Root = PaperworksPage;
  tab3Root = SettingsPage;

  constructor() {

  }
}

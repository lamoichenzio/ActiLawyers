import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaperworkItemPage } from './paperwork-item';

@NgModule({
  declarations: [
    PaperworkItemPage,
  ],
  imports: [
    IonicPageModule.forChild(PaperworkItemPage),
  ],
})
export class PaperworkItemPageModule {}

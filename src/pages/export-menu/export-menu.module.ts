import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExportMenuPage } from './export-menu';

@NgModule({
  declarations: [
    ExportMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(ExportMenuPage),
  ],
})
export class ExportMenuPageModule {}

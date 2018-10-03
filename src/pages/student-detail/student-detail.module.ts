import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StudentDetailPage } from './student-detail';
import {DatePipe} from "@angular/common";

@NgModule({
  declarations: [
    StudentDetailPage
  ],
  imports: [
    IonicPageModule.forChild(StudentDetailPage),
  ],
  providers: [DatePipe],
})
export class StudentDetailPageModule {}

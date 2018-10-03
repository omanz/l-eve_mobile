import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CoursesPage } from './courses';
import {DatePipe} from "@angular/common";
import {CalendarModule} from "ion2-calendar";

@NgModule({
  declarations: [
    CoursesPage

  ],
  imports: [
    IonicPageModule.forChild(CoursesPage),
    CalendarModule

  ],
  providers: [DatePipe],

})
export class CoursesPageModule {}

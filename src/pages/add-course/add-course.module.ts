import { NgModule } from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import { AddCoursePage } from './add-course';

@NgModule({
  declarations: [
    AddCoursePage
  ],
  imports: [
    IonicPageModule.forChild(AddCoursePage)
  ]
})
export class AddCoursePageModule {}

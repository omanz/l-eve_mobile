import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CourseDetailPage } from './course-detail';

import {ComponentsModule} from "../../components/components.module";

@NgModule({
  declarations: [
    CourseDetailPage
  ],
  imports: [
    IonicPageModule.forChild(CourseDetailPage),
    ComponentsModule
  ],

})
export class CourseDetailPageModule {}

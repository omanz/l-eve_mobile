import { NgModule } from '@angular/core';
import { RatingComponent } from './rating/rating';
import {IonicPageModule} from "ionic-angular";

@NgModule({
	declarations: [RatingComponent],
	imports: [IonicPageModule.forChild(RatingComponent),],
	exports: [RatingComponent]
})
export class ComponentsModule {}

import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Tabs} from 'ionic-angular';

/**
 * Generated class for the TabsPage tabs.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  studentsRoot = 'StudentsPage'
  coursesRoot = 'CoursesPage'
  homeRoot = 'HomePage'

  mySelectedIndex = 0;

  constructor(private nav: NavController,  public navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  selectTab(index: number) {
    var t: Tabs = this.nav.parent;
    t.select(index);
  }

}

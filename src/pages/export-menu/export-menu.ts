import { Component } from '@angular/core';
import {IonicPage, ViewController} from 'ionic-angular';

/**
 * Generated class for the ExportMenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-export-menu',
  templateUrl: 'export-menu.html',
})
export class ExportMenuPage {

  checkboxresume: boolean = true;
  checkboxcours: boolean = false;
  checkboxcsv : boolean = false;

  constructor(public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExportMenuPage');
  }

  close() {
    this.viewCtrl.dismiss();
  }

  export(){
    let mydata = {
      'checkboxresume' : this.checkboxresume,
      'checkboxcours' : this.checkboxcours,
      'checkboxcsv' : this.checkboxcsv
    };
    this.viewCtrl.dismiss(mydata);
  }
}

import { Component } from '@angular/core';
import {IonicPage} from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { FireBaseCtrlProvider} from "../../providers/fire-base-ctrl/fire-base-ctrl";
import { StudentProvider } from "../../providers/student/student";

/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-student',
  templateUrl: 'add-student.html',
})
export class AddStudentPage {

  student = new StudentProvider();
  contact = [];

  constructor(public viewCtrl : ViewController, public dbCtrl : FireBaseCtrlProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddStudentPage');
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  save(){
    // check if student exist
    this.dbCtrl.addStudent(this.student);
    this.viewCtrl.dismiss();
  }

  pickContact(): void {
    // retrieve contact
    navigator.contacts.pickContact((contact) => {
      console.log("contact found " + contact.name.familyName + " - " + contact.name.givenName);
      this.student.contact_id = contact.id;
      this.student.first_name = contact.name.givenName;
      this.student.name = contact.name.familyName;
      this.student.phoneNumber = contact.phoneNumbers &&  contact.phoneNumbers.length > 0 ? contact.phoneNumbers[0].value : '';
    }, (error) => {
      console.log("error in pick contact");
    })
  }

}

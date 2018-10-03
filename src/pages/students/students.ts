import { Component } from '@angular/core';
import {AlertController, Events, IonicPage, ModalController, NavController} from 'ionic-angular';
import {Observable} from "rxjs";
import {FireBaseCtrlProvider} from "../../providers/fire-base-ctrl/fire-base-ctrl";
import {map} from "rxjs/operators";

/**
 * Generated class for the StudentsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-students',
  templateUrl: 'students.html',
})
export class StudentsPage {

  eleves$: Observable<any>;

  constructor(public modalCtrl: ModalController, public dbCtrl: FireBaseCtrlProvider
  , public alertCtrl: AlertController, private navCtrl: NavController, private events : Events) {
    // Use snapshotChanges().map() to store the key
    // sort by first name
    this.eleves$ = this.dbCtrl.db.list('eleve', ref =>
      ref.orderByChild('first_name')).snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
      )
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentsPage');
  }


  openModal() {
    let modalPage = this.modalCtrl.create('AddStudentPage');
    modalPage.present();
  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(item) {
    let modalPage = this.modalCtrl.create('StudentDetailPage', {
      student: item,
      id: item.key
    });

    modalPage.onDidDismiss(data => {
      if (data && data.action == 'CoursePage'){
        console.log('go to course page with student ' + data.studentId)

        this.events.publish('filter-student', data.studentId, data.studentName);
        this.navCtrl.parent.select(1);
      }
    });
    modalPage.present();
  }

  deleteItem(key: string) {
    let alert = this.alertCtrl.create({
      title: 'Supprimer un élève',
      message: 'Voulez vous supprimer cet élève? Tous les cours associés seront supprimés',
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: () => {
            console.log('Cancel - course not deleted');
          }
        },
        {
          text: 'Supprimer',
          handler: () => {
            console.log('Delete course ' + key);
            this.dbCtrl.deleteStudent(key);
          }
        }
      ]
    });
    alert.present();
  }
}

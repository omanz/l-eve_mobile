import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {StudentProvider} from "../../providers/student/student";
import {FireBaseCtrlProvider} from "../../providers/fire-base-ctrl/fire-base-ctrl";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AngularFireList} from "angularfire2/database";

/**
 * Generated class for the AddCoursePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export const ObjectifStatus = {
  Atteint : 'Atteint',
  Partiellement: 'Partiel',
  NonAtteint: 'NonAtteint'
}

export interface Course {
  beginHour :number,
  endHour : number,
  studentId: string,
  studentName: string,
  capabilities : {technique: {}, road: {}};
  theme: string,
  objectif: string,
  objectif_status: string,
  parcours: string,
  remarque: string,
  nextCourse: string,
  paid: boolean
};

@IonicPage()
@Component({
  selector: 'page-add-course',
  templateUrl: 'add-course.html',
})

export class AddCoursePage {

  course = <Course>{};
  students$: Observable<any>;

  studentSelected : StudentProvider;

  beginDateFormat : string;
  endDateFormat : string;
  courseDbRef : AngularFireList<any>;


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl : ViewController, public dbCtrl: FireBaseCtrlProvider) {
    // Use snapshotChanges().map() to store the key
    this.courseDbRef = this.dbCtrl.db.list('eleve');
    this.students$ = this.courseDbRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
      )
    );
  }

  getLocalDate(myDate: string):string{
    let date = new Date();
    if (myDate) {
      date = new Date(myDate);
    }
    return new Date(date.getTime() - date.getTimezoneOffset()*60000).toISOString();
  }

  geUTCDate(myDate: string):string{
    let date = new Date(myDate);
    return new Date(date.getTime() + date.getTimezoneOffset()*60000).toISOString();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddCoursePage');
    // init date
    let now = new Date();
    this.course.beginHour = now.valueOf();//now.toISOString(); now;
    now.setHours(now.getHours() + 1);
    this.course.endHour = now.valueOf();


    this.beginDateFormat = this.getLocalDate(new Date(this.course.beginHour).toISOString());
    this.endDateFormat = this.getLocalDate(new Date(this.course.endHour).toISOString());
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  save(key: string){

    // set student info in course
    this.course.studentId = key;
    this.course.studentName = this.studentSelected.first_name + ' ' + this.studentSelected.name;

    let tmp = new StudentProvider();
    tmp.capabilities = this.studentSelected.capabilities;
    this.course.capabilities = tmp.getCapabilities();


    // convert date to utc due to a bug in ionic-date
    this.course.beginHour = new Date(this.geUTCDate(this.beginDateFormat)).valueOf();
    this.course.endHour = new Date(this.geUTCDate(this.endDateFormat)).valueOf();

    if (this.course.beginHour && this.course.studentId) {
      this.dbCtrl.addCourse(this.course);
    } else {
      alert("Données du cours incomplètes");
    }

    this.viewCtrl.dismiss();
  }

  updateEndDate(){
    let beginDate = new Date(this.beginDateFormat);
    let endDate = new Date(this.endDateFormat);
    endDate.setFullYear(beginDate.getFullYear(), beginDate.getMonth(), beginDate.getDate());
    this.endDateFormat = endDate.toISOString();
  }

}

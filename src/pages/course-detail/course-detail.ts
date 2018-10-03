import { Component } from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
import {Course, ObjectifStatus} from "../add-course/add-course";
import {CapabilityProvider} from "../../providers/capability/capability";
import {FireBaseCtrlProvider} from "../../providers/fire-base-ctrl/fire-base-ctrl";

/**
 * Generated class for the CourseDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-course-detail',
  templateUrl: 'course-detail.html',
})
export class CourseDetailPage {

  course : Course;

  beginDateFormat : string;
  endDateFormat : string;
  difference: string;
  courseKey : string;

  obj_partiel : boolean = false;
  obj_atteint: boolean = false;
  obj_non_atteint: boolean = false;

  capabilityTech = [];
  capabilityRoad = [];


  constructor(public viewCtrl: ViewController, public navParams: NavParams, public dbCtrl: FireBaseCtrlProvider) {
    this.course = navParams.get('course');
    this.courseKey = navParams.get('id');
    this.beginDateFormat = this.getLocalDate(new Date(this.course.beginHour).toISOString());
    this.endDateFormat = this.getLocalDate(new Date(this.course.endHour).toISOString());
    this.updateDifference();
    // convert objectif status
    if (this.course.objectif_status) {
      switch (this.course.objectif_status.toUpperCase()) {
        case (ObjectifStatus.Partiellement.toUpperCase()): {
          this.obj_partiel = true;
          break;
        }
        case (ObjectifStatus.NonAtteint.toUpperCase()): {
          this.obj_non_atteint = true;
          break;
        }
        case (ObjectifStatus.Atteint.toUpperCase()): {
          this.obj_atteint = true;
          break;
        }
      }
    }
    // convert capability to have iterable object

    let keys = Object.keys(this.course.capabilities.technique);
    this.capabilityTech = [];
    for (let prop of keys) {
      this.capabilityTech.push(this.course.capabilities.technique[prop]);
    }
    keys = Object.keys(this.course.capabilities.road);
    this.capabilityRoad = [];
    for (let prop of keys) {
      this.capabilityRoad.push(this.course.capabilities.road[prop]);
    }
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
    console.log('ionViewDidLoad CourseDetailPage');
  }

  updateDifference(){
    this.difference = this.msToTime(new Date(this.endDateFormat).valueOf() - new Date(this.beginDateFormat).valueOf());
  }

  updateEndDate(){
    let beginDate = new Date(this.beginDateFormat);
    let endDate = new Date(this.endDateFormat);
    endDate.setFullYear(beginDate.getFullYear(), beginDate.getMonth(), beginDate.getDate());
    this.endDateFormat = endDate.toISOString();
  }

  msToTime(duration : number) {
    let hours = Math.floor(duration/(1000 * 60 * 60));
    let minutes = Math.floor((duration - (hours * (1000 * 60 * 60))) /(1000 * 60));

    let hoursStr = (hours < 10) ? "0" + hours : hours;
    let minutesStr = (minutes < 10) ? "0" + minutes : minutes;

    return hoursStr + ":" + minutesStr;
  }

  save(){
    // convert date
    this.course.beginHour = new Date(this.geUTCDate(this.beginDateFormat)).valueOf();
    this.course.endHour = new Date(this.geUTCDate(this.endDateFormat)).valueOf();

    // convert objectif status
    if (this.obj_partiel){
      this.course.objectif_status = ObjectifStatus.Partiellement;
    } else if(this.obj_atteint){
      this.course.objectif_status = ObjectifStatus.Atteint;
    } else if(this.obj_non_atteint){
      this.course.objectif_status = ObjectifStatus.NonAtteint;
    } else{
      this.course.objectif_status = '';
    }

    // check if capabilities must be updated
    this.isTheLastCourse().then((value) => {
      if (value){
        this.dbCtrl.updateStudent(this.course.studentId, {capabilities: this.course.capabilities, lastCourse: this.course.beginHour});
      }else {
        alert("Un cours plus récent existe. Les capacités ne seront pas mises à jour sur le status de l'élève");
      }
      this.dbCtrl.updateCourse(this.courseKey, this.course);
      this.closeModal();
    })

  }

  changeRatingValue(capability: CapabilityProvider, score: number): void {
    for (let cap in this.course.capabilities.technique){
      if (this.course.capabilities.technique[cap].type == capability.type){
        this.course.capabilities.technique[cap].value = score;
        return;
      }
    }
    for (let cap in this.course.capabilities.road){
      if (this.course.capabilities.road[cap].type == capability.type){
        this.course.capabilities.road[cap].value = score;
        return;
      }
    }
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }


  isTheLastCourse(): Promise<boolean>{
    return new Promise<boolean>((resolve) => {
      this.dbCtrl.db.list('cours', ref =>
        // firebase can only order by one element. Get course per student first and next compare to the date
        ref.orderByChild('studentId').equalTo(this.course.studentId))
        .query.once('value', function(snapshot) : boolean{
        let lastCourseDate : number = this.course.beginHour;
        let currentCourseKey : number = this.courseKey;
        let isLastCourse: boolean = true;
        snapshot.forEach(function(course) {
          if (course.val() && course.val().beginHour > lastCourseDate && course.key != currentCourseKey){
            isLastCourse = false;
            return;
          }
        })
        resolve(isLastCourse);
        return isLastCourse;
      }.bind(this));
    });
  }

  /**
   * Toogle element between 3 checkbox
   * @param value
   */
  updateObjectifStatus(event){
    if (event.checked) {
      switch (event.getNativeElement().id) {
        case 'obj_atteint': {
          this.obj_atteint = true;
          this.obj_non_atteint = false;
          this.obj_partiel = false;
          break;
        }
        case 'obj_non_atteint': {
          this.obj_non_atteint = true;
          this.obj_atteint = false;
          this.obj_partiel = false;

          break;
        }
        case 'obj_partiel': {
          this.obj_partiel = true;
          this.obj_atteint = false;
          this.obj_non_atteint = false;
          break;
        }
      }
    }
  }
}

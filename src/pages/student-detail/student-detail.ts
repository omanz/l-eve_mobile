import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavParams, ViewController} from 'ionic-angular';
import {StudentProvider} from "../../providers/student/student";
import { Chart } from 'chart.js';
import {FireBaseCtrlProvider} from "../../providers/fire-base-ctrl/fire-base-ctrl";
import {SocialSharing} from "@ionic-native/social-sharing";
import {CapabilityRoadType, CapabilityTechType} from "../../providers/capability/capability";
import {DatePipe} from "@angular/common";


/**
 * Generated class for the StudentDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-student-detail',
  templateUrl: 'student-detail.html',
})
export class StudentDetailPage {

  @ViewChild('radarTechCanvas') radarTechCanvas;
  @ViewChild('radarRoadCanvas') radarRoadCanvas;

  myRadarTechChart: any;
  myRadarRoadChart: any;

  student : StudentProvider;
  studentId : string;

  constructor(public navParams: NavParams, public dbCtrl: FireBaseCtrlProvider,
              public viewCtrl: ViewController, private socialSharing: SocialSharing,
              private datePipe: DatePipe,) {
    this.student = navParams.get('student');
    this.studentId = navParams.get('id');
    if (!this.student){
      this.student = new StudentProvider();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StudentDetailPage ' + this.student.name);

    let student2 = new StudentProvider();
    student2.capabilities = this.student.capabilities;
    let capabilities = student2.getCapabilities();
    let capabilitiesTechLabels = [];
    let capabilitiesTechValues = [];

    for (let capability in CapabilityTechType){
      capabilitiesTechLabels.push(CapabilityTechType[capability]);
      capabilitiesTechValues.push(capabilities['technique'][capability]['value']);
    }

    let capabilitiesRoadLabels = [];
    let capabilitiesRoadValues = [];

    // iterate through all tech capabilities and if student has one, assign it
    for (let capability in CapabilityRoadType){
      capabilitiesRoadLabels.push(CapabilityRoadType[capability]);
      capabilitiesRoadValues.push(capabilities['road'][capability]['value']);
    }

    // draw background
    var backgroundColor = 'white';
    Chart.plugins.register({
      beforeDraw: function(c) {
        var ctx = c.chart.ctx;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, c.chart.width, c.chart.height);
      }
    });

    var title =  this.student.lastCourse ? 'Mis à jour le ' + this.datePipe.transform(this.student.lastCourse,'dd.MM.yyyy') : '';

    this.myRadarTechChart = new Chart(this.radarTechCanvas.nativeElement, {

      type: 'radar',
      data: {labels: capabilitiesTechLabels,
        datasets: [{
          backgroundColor: "rgba(255,99,132,0.2)",
          borderColor: "rgba(255,99,132,1)",
          pointBackgroundColor: "rgba(255,99,132,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(255,99,132,1)",
          label: "",
          data: capabilitiesTechValues
        }]
      },
      options : {
        title: {
          display: true,
          position: 'bottom',
          text: title
        },
       legend: {
          display: false
        },
        scale: {
          ticks: {
            min : -1,
            max: 5,
            stepSize: 1
          }
      }
    }

    });


    this.myRadarRoadChart = new Chart(this.radarRoadCanvas.nativeElement, {

      type: 'radar',
      data: {labels: capabilitiesRoadLabels,
        datasets: [{
          backgroundColor: "rgba(0,0,255,0.2)",
          borderColor: "rgba(0,0,255,0.3)",
          pointBackgroundColor: "rgba(0,0,255,1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(0,0,255,1)",
          label: "",
          data: capabilitiesRoadValues
        }]
      },
      options : {
        title: {
          display: true,
          position: 'bottom',
          text: title
        },
        legend: {
          display: false
        },
        scale: {
          ticks: {
            min : -1,
            max: 5,
            stepSize: 1
          }
        }
      }

    });




  }

  save(){
    // todo update courses if name is changed
    this.dbCtrl.updateStudent(this.studentId, this.student);
    this.viewCtrl.dismiss();
  }

  closeModal(){
    this.viewCtrl.dismiss();
  }

  closeModalAndGoToCourse(){
    this.viewCtrl.dismiss({action:'CoursePage', studentId: this.studentId, studentName: this.student.first_name + ' ' + this.student.name});
  }

  shareTechChart(){
    this.socialSharing.shareViaWhatsApp('Capacités techniques',this.myRadarTechChart.chart.toBase64Image()).then((result) => {
      console.log("Action whatsap reussie avec succes")
    ,(error) => {
        console.log("Action whatsap echouee " + error.message);
      }})
  }

  shareRoadChart(){
    this.socialSharing.shareViaWhatsApp('Capacités routières',this.myRadarRoadChart.chart.toBase64Image()).then((result) => {
      console.log("Action whatsap reussie avec succes")
        ,(error) => {
        console.log("Action whatsap echouee " + error.message);
      }})
  }


}

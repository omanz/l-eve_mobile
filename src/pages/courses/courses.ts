import { Component } from '@angular/core';
import {
  AlertController, Events,
  IonicPage,
  ModalController,
  Platform,
  PopoverController
} from 'ionic-angular';
import {Observable} from "rxjs";
import {FireBaseCtrlProvider} from "../../providers/fire-base-ctrl/fire-base-ctrl";
import {debounceTime, map} from "rxjs/operators";
import {FormControl} from "@angular/forms";
import {Course, ObjectifStatus} from "../add-course/add-course";
import {DatePipe} from "@angular/common";
import * as XLSX from "xlsx";
import {File} from "@ionic-native/file";
import {CalendarModal, CalendarModalOptions, CalendarResult} from "ion2-calendar";
import {ExportMenuPage} from "../export-menu/export-menu";
import {FileOpener} from "@ionic-native/file-opener";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {CapabilityRoadType, CapabilityTechType} from "../../providers/capability/capability";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

/**
 * Generated class for the CoursesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-courses',
  templateUrl: 'courses.html',
})
export class CoursesPage {

  courses$: Observable<any>;
  searchTerm: string = '';
  courses: Course[];
  coursesFiltered:  Course[];
  searching: any = false;
  searchControl: FormControl;
  subscription: any;
  totalHeures : {h: number, mn: number};

  starIcon:string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAvCAYAAAChd5n0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gkRDx0OYWVEhAAAA49JREFUaN7d2m2MXGMUB/Df3bG2Y1vUBrWSFo0N+sWSeNlYWmmQbEgUiybaSISKKmmEfpDwRSKRaAiJpCQSQlZEU5GQKl801kuUD7pJ0dZbUCxtNmVpp+PDHjFZdl52772dcZJJZu59nvPMmXPO//zPuUO2ciTe9D+QS1HGuVkf1Jah7gRLsQfrWtkbszCM8zGGua3qkYU4iPfxUXinJQ25E1vi/ZMYQKEVQ2s/FsX747ENR7WaR1bia2yHJEn24kec12re+BA3/0eobWolI07HNz09PZOvd6OEo7M4NIvkG8Ch0dHRTUmSVF4fwxJ0YWuzeyPBRiye4v5l2NEKYVXECOZVWfMZzm521FqBz/FDlTUbcUmze+QLXFtjzTl4K8KwKaUX41WRpVAQnGsEJzRraN2GDdUWlEol+BXvYXXaKLMBffgFv88Aknvj9VUda/vxYnhmOueV0IljgpCuTQLX1+MGXBPw2DGNGD6ET+sqXoVCoVQqnTEDIxYESxjC3fi5csG6IHp9bW1tSXCkpki+zs7Oyo9nRnjeVW3P5diNtV1dXU2FKsViEe7B91hWz555kYxbIsSaRV4L2O5udOMzQcO7D7MBC7ALL8+EG94eVfqmvHJm0hk3BlO4Iw3dp2FnkiTrc/bEU5EPqfKyY/EB3o62NUs5Ea/EecWsepf7g71e9PfF9vb2NM9YEvofzngwAq7AgWhd02QYK4OrLc0zfk/Fn0Ft0pA5+KNi6pIbaRzDviRJRlIyZDxq1/68DbkFH5fL5b0pQfJBfIKL8y5SO3B9yjqX4dU8jTilVgM1A72jeYbWYtk8vPkyCuBgHoa0BdY/18CeRuD0eazKI6zm4N2ovrWkIzw3HnuOq7Oqj5vGNLJRj8yNTnCsBgMYwLdRpWcFtG6PfqcaFdgTe/qz9shqPD44OGUYnxQt6Fb/nl31hUFvYH6VM+7FI1kbMoyrp7i3PKjLg1UaskL02L/huiro9U5WhFHE7YEYVlTKfDwdIXFBnbouNDHMG4ovPvmc4SxZ9ppI2kpZhe/wAGY3qG827ovx0ZpJefsCrsrKkG3+eXjTHlV4d414r0cWhjGbK9DqVryUhREn4ycT/2RYHsXriRoI1Kg8ip3R3p6FfVkYMmDicdrrEV69GXl9UST65oD4K1OdB0QOlPFYTnzuoehPhtJUekTget4Uux/PmpjxpuaRosMjHfFD1pS/AIu7s67XrIPmAAAAAElFTkSuQmCC';
  starNewIcon: string = 'data:image/png;base64,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';
  starFillIcon: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAvCAYAAAChd5n0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gkRDx8MvV1HKgAAA7lJREFUaN7d2VuIVWUUB/DfPnMfnRyZMScltaSHsoesIBsanaKLYAXZXSjppYzURKJ8iOwlCIKkKBIsCIpiIhIjSNSCLqgUCdENK5tCMmWmIqRpcmbO7uGsQgbnOJezz8xpwQeHw97r2/9v3f5rfWQrtdjtfyBXIcUlWW+Uy1B3gqtxDJsq2Rr12IfLcBwzK9UiCzGI/fgsrFORQNZhT/x+HitQVYmu9ScWIe3YvLUTB9BYaSBW45vIWGlSV59iJzorDcinuOdfILHWYUclgTgPh5PqmnQYkDkYwhmVEuxLsDsdHBj+/8/4EA9UgjUSbI9YSE+xrsXBSgDSgK/RNgKQFN/ioqnuWnfjO/xS5JntWDbVLfI9bilijRQX471wwykpi9EvlysGIq1tnTMU7nfmVHWt+7BNPl/0oRO9R3LBv9aWOstsQzt+w18T4EOLY/04imeX4vWwzHj2G8I0zAhCujFBC7bgDtwc6bFuHD6cxxejOr3qGungwIUTADE/WEIXNqD35Ac2BdFrlyTpaQJ2Mtf5+B0PFkN7HbqxUVX11AJQSCIPRWpfORrTtUUw7qmaNmMqgXkn0vacsfriS/gqXpxMAPPxA96cSGN2P47irkkCcWcwhZIQzXNxKEmSLWUGsTXioaS8rBmf4P2Ox15YljGA2Xgr9mvIgoJU4dFgr1dkBOLK0P9kxoMRsBwD0bqWBkChbq1Gf9Zjo+FyDk4EtZkwkJqWtjz+jqlLWaUVPbWz5uZLASSpqUvxARZMxO/HI+vRMNR3fGFpziUlTXcoTO8/L6dFDuL2Egf6SrxdThAL0J8BF1uAX8vZWHVit6HBUh9QdxTA28oBJBe5/pXRtW0JXDMG/a9iTTncqgl7o/oWdZVcY1OqcO3Wj721s88eHGVV7x/PNHKsFpmJfFVT89GR82A1XJ/vO94bVboe+08cO9yD5UldfTH9R+OdjqwtshbPFjnRs6IF/fgUs6v26HN2Yl4RHQ/jqayB7MNNI3zAqqAuj0fPP1Ld2oA+3Foke32UFWEUfjvQcmnnl8M2nocXwyWWjFLX5THM64oP/09fdXNrGgc2Kysg6yPQTwaxBkewGdPHqG86HsFPobugs1CfXsONWQE5IC5vcvWNaVTh7rDIRGRhgNkV5DHFvXgjCxBz0RNcaFUM4Z5DTQn3eBqHor29AH9kAWSFwnXau+FeizOy+qII9F0Kd/M3lHqsujlM/kyZ+NwT0Z90lVJpdeT1pWXueTrwcsx4S2aRBpMjdXGQp5V/ACZQaOHR5TtbAAAAAElFTkSuQmCC';
  starRedIcon: string = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAvCAYAAAChd5n0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4gkRDzg2oZQs/QAABCNJREFUaN7Vmm2IVFUYx39nt11fNlOhXAS31IUUTAQVqSg1NWc/aMnkhlIrRpoSFRKZRVRIFPQl/LJE9UGStURk0LKotBcI9kNJ2poW4nspmpVJ4du68+/DfQZu08zunbv3THsPXIZz7sw553+e//N6Bjw2wRBBJ2lvgvkCCe7yvVaNRxA1wL3ABWBdmqUxRLBPcLfgb8GoVEoEmAhcdvA1sB+Y6xOI8yiRTcAJYK9gsIMFQJuDnjTRqlZwVTBF0CFoFPwoaEgbtVYCJ4G1QE5wHjgFzEybou8VPCbIhsbWCHalCcREwdk8LA6NZQU3m0+5MS3UuhPYXQPbCiAInukEXv6pNEjDCT4WzAtJoqNAMcECwRF5OMCkJ7wemAAcDEki5yBn7+uBWmDqQAfyKHAQuL0YRAjYdmD2QKfWz4KlYToVUywP0wd0RCy4Q9Cdh83lQADkYYbgkGDMgAxRBBuBq0anT4volHOBYyz0e4BzDp5JDIigA5hB4H0vAdcFe6j4QCYD0xwc7gNEztbaAvwUU097CMKdYRaQPuksvG4HHgBagR+AwXGE4qCrLxAOcnlodf0D0WwHsgNY7eDXMDVeFVwUzMpDi3nhTOh9psRYtoRi/+t7JXxJv/p5mCz4S/B8bzxfJDgtWKv/hhgdvSmxbxDdtbVO8Jzgd8GSKEo7RtAl+FIwtIwk+pSOh/5ngk5BU6VW6H3BYQOWrUQ6SUpGMF5wUvChoC6uSV0jOC94pAJJJAmiTXBC8HQS/mGC4JSca4+hE7FBCTYKflPgGhJzdjdZstQpaIy4qbggRgt2Cr4XDPcRgtQLXhEcE9zjyTrNFxwVbIitDxXkG1nBNQX5eBx6leuvsHnvq2aAeJsgL5hZIb3K9efY51Sq2cwk/yFY38smK1HsOsE3gvHVBrLeHGZSzq5F0C5YVW0gxwRtCfuNVsHn1QRxq6DbqolxdSJTgl7NggterVURkJWCXR5iqYyVVZdXq6b7nuDhiCffYk9UybxUlXxecIPdeYyOcNJLBF+Ymf42SkQgaBJc8VWNDAMZJ9gjWNrLpjYL7hf8KXjHxt+yPGJhBMNwSLDIN5BnFaTFhUWLN9Uk+Mh8wtyi3862PGe3KXY5er0o2OAbSJdgcZmTXG7W7HWVyflNx16w7y0rQ69mO4ihvkCMElzrCS5twiDGCt413zIr4lxzBMcFH9jGw5J5yPSw0ReQdaa0YRBPCM5Z4WJ4hfONELxcqBEU6dhWwYO+gOwXrLLF6gWfCH5RUJrpz7yTBGcEX9mTETwu2OkDxC0WJDZY+nnaLNGgBNdot3mX2d3jRSV9WWvm9IBVMvYouLTxcWBTBN+ZZC4lSi9Lpl4zhXy7SmHQG3YrvCPJSesEb8rzhX+JdecJtghGJimRBv6HZn8DiRQN/wMFstGHrqBGYAAAAABJRU5ErkJggg==';

  pdfObj = null;


  period ={
    from : new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 15),
    to:new Date((new Date().setDate(new Date().getDate() + 1)).valueOf() -1)
  }

  constructor( public modalCtrl: ModalController, public dbCtrl: FireBaseCtrlProvider, private datePipe: DatePipe,
              public alertCtrl: AlertController, public file: File,
              public popoverCtrl: PopoverController,
              private fileOpener: FileOpener,
              private plt: Platform,
              private events: Events) {

    // if data come from others pages: warning, if this page is not open before, this will not work!
    this.events.subscribe('filter-student', (id, name) => {
      this.getDatabaseDataByStudent(id, name);
    });

    this.getDatabaseData();

    this.searchControl = new FormControl();
    this.totalHeures = {h:0, mn:0};
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoursesPage');
    this.setFilteredItems();

    this.searchControl.valueChanges.pipe(debounceTime(700)).subscribe(search => {
      this.searching = false;
      this.setFilteredItems();
    });
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(ExportMenuPage);
    popover.present({
      ev: myEvent
    });
    // get the data from popover
    popover.onDidDismiss(data => {
      if(data!=null){
        if (data.checkboxcsv){
          console.log('export to csv');
        }
        if (data.checkboxresume || data.checkboxcours){
          console.log('export to pdf');
          this.exportToPdf(data.checkboxresume, data.checkboxcours);
        }
      }
    })
  }

  getDatabaseData() {
    if (this.subscription)
      this.subscription.unsubscribe();
      this.courses$ = this.dbCtrl.db.list('cours', ref =>
        ref.orderByChild('beginHour').startAt(this.period.from.getTime())
          .endAt(this.period.to.getTime()))
        .snapshotChanges()
        .pipe(
          map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
          )
        );
     this.subscription = this.courses$.subscribe(val => {
       this.courses = val;
       this.setFilteredItems();

     });
  }

  getDatabaseDataByStudent(studentId: string, strudentName: string) {
    this.dbCtrl.db.list('cours', ref =>
      ref.orderByChild('studentId').equalTo(studentId))
      .query.once('value').then((courses) =>{

      let firstCourse = new Date();
      if(courses) {
        courses.forEach(cours => {
          firstCourse = firstCourse > cours.val().beginHour ? cours.val().beginHour : firstCourse;
        })
      };
      this.searchTerm = strudentName;
      firstCourse = new Date(firstCourse);
      this.period ={
        from : new Date(firstCourse.getFullYear(), firstCourse.getMonth(), firstCourse.getDate()),
        to:new Date((new Date().setDate(new Date().getDate() + 1)).valueOf() -1)
      }

      this.getDatabaseData();

     });
  }

  openModal() {
    let modalPage = this.modalCtrl.create('AddCoursePage');
    modalPage.present();
  }

  openItem(item) {
    let modalPage = this.modalCtrl.create('CourseDetailPage',
      {
        course: item,
        id: item.key
      });
    modalPage.present();
  }

  onSearchInput(){
    this.searching = true;
  }

  setFilteredItems() {
    let foundItems: Course[] = [];
    if (this.courses) {
      if (this.searchTerm && this.searchTerm.length > 0) {
        this.courses.forEach(item => {
          if (item.studentName.toUpperCase().indexOf(this.searchTerm.toUpperCase()) >= 0) {
            foundItems.push(item);
          } else if (item.beginHour) {
            let beginDateFormatted = this.datePipe.transform(item.beginHour, 'dd.MM.yyyy - HH:mm');
            if (beginDateFormatted.indexOf(this.searchTerm) >= 0) {
              foundItems.push(item);
            }
          }
        })
      }
      else {
        foundItems = this.courses;
      }
    }
    this.coursesFiltered = foundItems;
    this.updateTotalHour();
  }

  updateTotalHour(){

    let totMs = 0;
    if (this.coursesFiltered && this.coursesFiltered.length > 0){
      this.coursesFiltered.forEach((cours) => {
        totMs += cours.endHour - cours.beginHour;
      })
    }

    let minutes = Math.floor((totMs / (1000 * 60)) % 60);
    let hours = Math.floor((totMs / (1000 * 60 * 60)));

    this.totalHeures ={h:hours, mn:minutes};
  }

  getHourSring(): string{
    let mystring = this.totalHeures.h + 'h';
    if (this.totalHeures.mn < 10){
      mystring += '0';
    }
    mystring += this.totalHeures.mn;
    return mystring;
  }

  deleteItem(key: string) {
    let alert = this.alertCtrl.create({
      title: 'Supprimer un cours',
      message: 'Voulez vous supprimer ce cours?',
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
            this.dbCtrl.deleteCourse(key);
          }
        }
      ]
    });
    alert.present();
  }

  /********************************/
  exportFile(){
    this.OnExport();
  }

  getStoragePath()
  {
    let file = this.file;
    return this.file.resolveDirectoryUrl(this.file.externalRootDirectory).then(function (directoryEntry) {
      return file.getDirectory(directoryEntry, "Ionic2ExportToXLSX", {
        create: true,
        exclusive: false
      }).then(function () {
        return directoryEntry.nativeURL + "Ionic2ExportToXLSX/";
      });
    });
  }

  OnExport()
  {
    let sheet = XLSX.utils.json_to_sheet(this.coursesFiltered);
    let wb = {
      SheetNames: ["export"],
      Sheets: {
        "export": sheet
      }
    };

    let wbout = XLSX.write(wb, {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary'
    });

    function s2ab(s) {
      let buf = new ArrayBuffer(s.length);
      let view = new Uint8Array(buf);
      for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    }

    let blob = new Blob([s2ab(wbout)], {type: 'application/octet-stream'});
    let self = this;
    this.getStoragePath().then(function (url) {
      self.file.writeFile(url, "export.xlsx", blob).then(() => {
        alert("file created at: " + url);
      }).catch(() => {
        alert("error creating file at :" + url);
      });
    });
  }

  openCalendar() {
    const options: CalendarModalOptions = {
      pickMode: 'range',
      title: 'Période',
      defaultDateRange: this.period,
      canBackwardsSelected: true,
      to: new Date()
    };

    let myCalendar = this.modalCtrl.create(CalendarModal, {
      options: options
    });

    myCalendar.present();

    myCalendar.onDidDismiss((date: { from: CalendarResult; to: CalendarResult }, type: string) => {
      if (date) {
        this.period.from = date.from.dateObj;
        let toEndDate = date.to.dateObj;
        toEndDate.setDate(date.to.dateObj.getDate() + 1);
        this.period.to = new Date(toEndDate.valueOf() - 1);
        this.getDatabaseData();
      }
    });
  }

  //retrieve one course before the passed in parameter if exist
  getLastCourse(userId: string, courses : Course[]): Promise<any[]>{

    return this.dbCtrl.db.list('cours', ref =>
      ref.orderByChild('studentId')
        .equalTo(userId)).query.once('value').then((snapshot) =>{

          let finalmap = [];

          // at least one course must be found as we select by course!
          if (snapshot) {

            // create map with start time as key
            let coursesMap = new Map<number, Course>();
            snapshot.forEach((childSnapshot) => {
              let course = childSnapshot.val();
              coursesMap.set(course.beginHour, course);
            })
            // get the key and ordered it
            let keyArray =  Array.from( coursesMap.keys());
            let keyArraySorted= keyArray.sort((a,b) => {
              return a - b;
            });

            // for each course we have to analyse
            courses.forEach((course) => {
              let index = keyArraySorted.findIndex((value => value == course.beginHour));
              let previousItem = keyArraySorted[index - 1];
              console.log('search for course ' + course.beginHour + ' index ' + index + ' previousItem ' + previousItem);
              finalmap.push({actual: course, previous: coursesMap.get(previousItem)});
            });
          }

      return finalmap;
    });
  }

// get a table with courses sorted by student id (student => courses[]
  getStudentsCourse() : any[]{
    let myStudentList = [];
    this.coursesFiltered.forEach(course => {
      let find = myStudentList.find(cours => cours.studentId === course.studentId);
      if (find) {
        find.courses.push(course);
      } else {
        myStudentList.push({studentId : course.studentId, courses: [course]})
      }
    });
    return myStudentList;
  }

  getCourseDiff(): Promise<any>{
    let promises_array:Array<any> = [];
    let studentResume = this.getStudentsCourse();
    console.log('studentResume ' + studentResume.length);
    studentResume.forEach((student) => {
      promises_array.push(this.getLastCourse(student.studentId, student.courses).then((result) => {
         return result;
        }));
    });
    return Promise.all(promises_array);
  };

  /**
   * Generate, save and open pdf according to user choice
   * @param resume if yes, resume is generated
   * @param detail if yes, details courses page are generated
   */
  exportToPdf(resume: boolean, detail: boolean): Promise<any>{
    var pdfdata = [];

    // generate page content
    if (resume) {
      pdfdata = this.getResumePdfcontent();
    }

    let promise = new Promise<any>(null);
    if (detail){
      // method to get the previous course
      let env = this;
      promise = this.getCourseDiff().then((promisesArray) => {
        // flat the result
        let flatCourse = [];
        promisesArray.forEach(promise => {
          promise.forEach((coursesDuo) => {
            flatCourse.push(coursesDuo);
          })
        })
        // stream the courses list
        env.coursesFiltered.forEach((course) => {
          // find last course in my array
          let duoCourses = flatCourse.find((item => item.actual.beginHour === course.beginHour));
          if (pdfdata.length > 0){
            pdfdata.push({text: '', pageBreak: 'after'});
          }
          console.log('before generateCoursePage');
          let oldCap = duoCourses.previous ? duoCourses.previous.capabilities : undefined;
          pdfdata.push(this.generateCoursePage(duoCourses.actual, oldCap));
        })
      })
    }
    promise.then((result) => {
      // if content is present, generate pdf, save it and open it
      if (pdfdata.length > 0) {
        let docDefinition = this.createPdfPage(pdfdata);
        this.pdfObj = pdfMake.createPdf(docDefinition);
        console.log('pdf created ');
        this.downloadPdf();
      } else {
        console.log("no content to export");
      }

    });
    return new Promise<any>(null);

  }

  /**
   * Generate content of resume page
   */
  getResumePdfcontent(): any{

    // create course table
    var tabledata = [];
    tabledata.push([ {text: 'Date', style: 'tableHeader'},
                     {text: 'Heure début', style: 'tableHeader'},
                     {text: 'Heure fin', style: 'tableHeader'},
                     {text: 'Eleve', style: 'tableHeader'},
                     {text: 'Durée (mn)', style: 'tableHeader'}]);

    this.coursesFiltered.forEach((course) => {
    tabledata.push([
                     this.datePipe.transform(course.beginHour, 'dd.MM.yyyy'),
                     this.datePipe.transform(course.beginHour, 'HH:mm'),
                     this.datePipe.transform(course.endHour, 'HH:mm'),
                     course.studentName,
                     (course.endHour -  course.beginHour) / 1000 / 60]);
    });

    return [

      { text: 'Cours dispensés par Aleksandar Jovic', style: 'header',alignment: 'center' },

      { text: 'Période', style: 'subheader' },
      { text: this.datePipe.transform(this.period.from, 'dd.MM.yyyy') + ' - ' +
          this.datePipe.transform(this.period.to, 'dd.MM.yyyy')},

      { text: 'Nombre d\'heures', style: 'subheader' },
      this.getHourSring(),

      { text: 'Détail', style: 'subheader' },
      {table: {
          widths: ['auto', 'auto','auto','*','auto'],
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
          headerRows: 1,
          body: tabledata
        },
        layout: 'lightHorizontalLines'
      },
    ];
  }

  generateRatingImg(title: string, oldValue: number, newValue: number): any[]{
    let data = [];
    data.push(title);
      for (var _i = 1; _i <= 5; _i++){
      let img = this.starIcon;
      if (_i <= oldValue) {
        if (_i > newValue) {
          // you loose a star!
          img = this.starRedIcon;
        } else {
          img = this.starFillIcon;
        }
      } else if(_i <= newValue) {
        img = this.starNewIcon;
      }
      data.push({image: img,
        width: 10});

    }
    return data;
  }


  generateRatingBlock(capabilities: any, previouscap : any, type: any): any[]{

    var capTech = [];

    let capabilityDuo = [];
    // iterate in the right order
    for (let prop in type){
      let oldcap = previouscap ? previouscap[prop] : undefined;

      if (!!oldcap){
        capabilityDuo.push({new: capabilities[prop], old: oldcap});
      } else {
        capabilityDuo.push({new: capabilities[prop], old: {}});
      }
    }
    capabilityDuo.forEach((capability) => {
        let myLine = {columns: []};
        let oldCap = capability.old ? capability.old.value : undefined;
        this.generateRatingImg(capability.new.type, oldCap,capability.new.value).forEach((data) => {
          myLine.columns.push(data);
        })
        capTech.push(myLine);
      }
    );
    return capTech;
  }
  /**
   * Generate content of one course page
   */
  generateCoursePage(course : Course, previous : any) : any{

    let capTech = this.generateRatingBlock(course.capabilities.technique, previous ? previous.technique : undefined, CapabilityTechType);
    let capRoad = this.generateRatingBlock(course.capabilities.road, previous ? previous.road : undefined, CapabilityRoadType);


    let objectifStatusStr = '';
    switch (course.objectif_status) {
      case ObjectifStatus.Atteint:
        objectifStatusStr = 'Atteint';
        break;
      case ObjectifStatus.Partiellement:
        objectifStatusStr = 'Partiellement atteint';
        break;
      case ObjectifStatus.NonAtteint:
        objectifStatusStr = 'Non atteint';
        break;
    }

    return [


      { text: 'Cours dispensé par Aleksandar Jovic', style: 'header',alignment: 'center' },

      { text: 'Eleve: ' + course.studentName, style: 'subheader' },

      { text: 'Date: ' + this.datePipe.transform(course.beginHour, 'dd.MM.yyyy') +
        ' ' + this.datePipe.transform(course.beginHour, 'HH:mm') + ' - ' +
          this.datePipe.transform(course.endHour, 'HH:mm'), style: 'subheader' },
      { text: 'Capacités', style: 'subheader' },
      {table: {
      body: [
        [ capTech,capRoad]
      ]
      }},

      { text: 'Theme de la leçon', style: 'subheader' },
      {
        table: {
          heights: 40,
          widths: ['*'],
          body: [
            [course.theme ? course.theme : '']
          ]
        }
      },

      { text: 'Objectif \t-\t' + objectifStatusStr, style: 'subheader' },
      {
        table: {
          heights: 40,
          widths: ['*'],
          body: [
            [course.objectif ? course.objectif : '']
          ]
        }
      },


      { text: 'Parcours', style: 'subheader' },
      {
        table: {
          heights: 40,
          widths: ['*'],
          body: [
            [course.parcours ? course.parcours : '']
          ]
        }
      },

      { text: 'Remarques', style: 'subheader' },
      {
        table: {
          heights: 40,
          widths: ['*'],
          body: [
            [course.remarque ? course.remarque : '']
          ]
        }},

      { text: 'Sujet de la prochaine leçon', style: 'subheader' },
      {
        table: {
          heights: 40,
          widths: ['*'],
          body: [
            [course.nextCourse ? course.nextCourse : '']
          ]
        }},
    ]
  }

  /**
   * Generate pdf structure
   * @param data document content
   */
  createPdfPage(data : any[]){
    return {
      content: data,


      styles: {
        header: {
          fontSize: 18,
          bold: true,
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 15, 0, 0]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        }
      }
    }
  }

  /**
   * download and open a pdf
   */
  downloadPdf() {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });

        // Save the PDF to the data Directory of our App
        var fileName = 'lvlUp-' + this.datePipe.transform(new Date(), 'yyyyddMM-HHmm') + '.pdf';
        this.file.writeFile(this.file.dataDirectory, fileName, blob, { replace: true }).then(fileEntry => {
          console.log("fichier crée sous " + this.file.dataDirectory + '/' + fileName);
          // Open the PDf with the correct OS tools
          this.fileOpener.open(this.file.dataDirectory + '/' + fileName, 'application/pdf').then((value) => {
            console.log("fichier ouvert");
          }, (error) =>
            alert("Impossible d'ouvrir le fichier " + error.message));
        })
      });
    } else {
      // On a browser simply use download!
      this.pdfObj.download();
    }
  }
}

import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {StudentProvider} from "../student/student";
import {Course} from "../../pages/add-course/add-course";
import "rxjs-compat/add/operator/map";

@Injectable()
export class FireBaseCtrlProvider {

  public elevesRef: AngularFireList<any>;
  public coursesRef: AngularFireList<any>;

  constructor(public db: AngularFireDatabase) {
    console.log('Hello FireBaseCtrlProvider Provider');

    this.elevesRef = this.db.list('eleve');
    this.coursesRef = this.db.list('cours');
  }

  addStudent(student: StudentProvider) {
    this.elevesRef.push(student);
  }
  addCourse(course: Course) {
    this.coursesRef.push(course);
  }
  updateStudent(key: string, data: any) {
    this.elevesRef.update(key, data);
  }
  updateCourse(key: string, data: any) {
    this.coursesRef.update(key, data);
  }
  deleteStudent(key: string) {
    if (key) {
      this.elevesRef.remove(key);
      this.db.list('cours', ref =>
        ref.orderByChild('studentId').equalTo(key))
        .query.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
          childSnapshot.ref.remove(error => {
            error ? console.log("cannot remove course linked to student due to error " + error.message) :
              console.log("removed course due to student removal ")
          });
        })
      })
    } else {
      console.log("missing key when we try to delete a student");
    }
  }
  deleteCourse(key: string) {
    if (key){
      this.coursesRef.remove(key);
    } else {
      console.log("missing key when we try to delete a course");
    }

  }
  deleteEverything() {
    this.elevesRef.remove();
  }

}

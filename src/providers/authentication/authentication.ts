import { Injectable } from '@angular/core';
import firebase from "firebase";
import {GooglePlus} from "@ionic-native/google-plus";
import {NativeStorage} from "@ionic-native/native-storage";
import {BehaviorSubject, Observable} from "rxjs";

/*
  Generated class for the AuthenticationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthenticationProvider {

  userProfile: any = null;
  $userProfile:BehaviorSubject<any>;

  constructor(public googlePlus:GooglePlus, private nativeStorage: NativeStorage) {
    console.log('Hello AuthenticationProvider Provider');

    this.$userProfile = new BehaviorSubject<any>(null);
    let env = this;
    nativeStorage.getItem('user')
      .then( function (data) {
        // user is previously logged and we have his data
        // we will let him access the app
        console.log("user already logged");
        env.setUserProfile(data);

      }, function (error) {
        //we don't have the user data so we will ask him to log in
        console.log("user have to log in");
      });
  }

  ngOnInit() {
    //Set up a listener for the when the AuthState changes (Login/Logout) and perform some action.
    firebase.auth().onAuthStateChanged( user => {
      if (user){
        let userDb = {
          name: user.displayName,
          email : user.email,
          photoURL: user.photoURL,
          lastLoginAt : user.metadata.lastSignInTime
        }
        this.setUserProfile(userDb);
      } else {
        this.setUserProfile(null);
      }
    });
  }

  googleLogin(): Promise<any> {
    let env = this;
    return new Promise((resolve, reject) => {
      //this.googlePlus.login({'webClientId': 'xxx'})
      this.googlePlus.login({'webClientId': 'xxx'})
        .then( res => {
          const googleCredential = firebase.auth.GoogleAuthProvider
            .credential(res.idToken);

          firebase.auth().signInWithCredential(googleCredential)
            .then( response => {
              console.log("Firebase success: " + JSON.stringify(response));
              resolve(response);
              let user = {
                name: response.displayName,
                email : response.email,
                photoURL: response.photoURL,
                lastLoginAt : response.metadata.lastSignInTime
              };
              env.nativeStorage.setItem('user', user);
              env.setUserProfile(user);
            });
        }, err => {
          console.error("Error: ", err)
          reject(err);
        });
    });
  }

  doGoogleLogout(){
    let env = this;
    // remove user
    env.nativeStorage.remove('user');
    this.setUserProfile(null);

    // log out from firebase
    firebase.auth().signOut().then( response =>
    {
      console.log('log out from firebase');
      // log out from google, try silent login before to log out.
      // if silent login fails, user are already log out
      this.googlePlus.trySilentLogin().then(
        (response) => {
          this.googlePlus.logout()
            .then(function (response) {
              //env.nativeStorage.remove('user');
              console.log('log out');
            }).catch((error) => {
            console.log(error);
          })
        },(error) => {
          this.googlePlus.logout()
            .then(function (response) {
              //env.nativeStorage.remove('user');
              console.log('log out');
            }).catch((error) => {
            console.log(error);
          })
        }
      ).catch((error) => {
        this.googlePlus.logout()
          .then(function (response) {
            //env.nativeStorage.remove('user');
            console.log('log out');
          }).catch((error) => {
          console.log(error);
        })
      })
    },error => {
      console.log(error);
    });


  }

  public getUserProfile(): Observable<any> {
    return this.$userProfile.asObservable();
  }

  public setUserProfile(newValue: any): void {
    this.userProfile = newValue;
    this.$userProfile.next(this.userProfile);
  }

}

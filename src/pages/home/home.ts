import { Component } from '@angular/core';
import {IonicPage} from "ionic-angular";
import {AuthenticationProvider} from "../../providers/authentication/authentication";
import {AppVersion} from "@ionic-native/app-version";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userProfile: any = null;
  version:string;

  constructor(private auth : AuthenticationProvider, public appVersion : AppVersion) {
    appVersion.getVersionNumber().then( value => {
        this.version = value;
      }
    )
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.userProfile = this.auth.userProfile;
    this.auth.$userProfile.subscribe((value) => {
      this.userProfile = value;
    })
  }

  googleLogin() {
    this.auth.googleLogin();
  }

  doGoogleLogout(){
    this.auth.doGoogleLogout();
  }

}

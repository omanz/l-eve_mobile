import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

import {TabsPage} from "../pages/tabs/tabs";
import {NativeStorage} from "@ionic-native/native-storage";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = TabsPage;

  constructor(platform: Platform, private splashScreen: SplashScreen, private nativeStorage: NativeStorage) {
    platform.ready().then(() => {
      // Here we will check if the user is already logged in
      // because we don't want to ask users to log in each time they open the app
      let env = this;
      this.nativeStorage.getItem('user')
        .then( function (data) {
          // user is previously logged and we have his data
          // we will let him access the app
          console.log("user already logged");
          env.splashScreen.hide();

        }, function (error) {
          //we don't have the user data so we will ask him to log in
          console.log("user have to log in");
          env.splashScreen.hide();
          env.nav.setRoot(TabsPage, { tabIndex: 2 });
        });
    });
  }

}


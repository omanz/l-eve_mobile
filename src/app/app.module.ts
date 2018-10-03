import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { FIREBASE_CONFIG } from './firebase.credentials';
import { FireBaseCtrlProvider } from '../providers/fire-base-ctrl/fire-base-ctrl';
import { StudentProvider } from '../providers/student/student';
import {File} from '@ionic-native/file';
import {CalendarModule} from "ion2-calendar";
import {FileOpener} from "@ionic-native/file-opener";
import {SocialSharing} from "@ionic-native/social-sharing";
import {ExportMenuPageModule} from "../pages/export-menu/export-menu.module";
import {TabsPageModule} from "../pages/tabs/tabs.module";
import {GooglePlus} from "@ionic-native/google-plus";
import {NativeStorage} from "@ionic-native/native-storage";
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import {TabsPage} from "../pages/tabs/tabs";
import {AppVersion} from "@ionic-native/app-version";



@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFirestoreModule.enablePersistence(),
    AngularFireDatabaseModule,
    CalendarModule,
    ExportMenuPageModule,
    TabsPageModule

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    HttpClient,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FireBaseCtrlProvider,
    StudentProvider,
    File,
    FileOpener,
    SocialSharing,
    GooglePlus,
    NativeStorage,
    AuthenticationProvider,
    AppVersion
  ],
})
export class AppModule {}

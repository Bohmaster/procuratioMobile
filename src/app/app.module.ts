import { VisitDetail } from './../pages/visit-detail/visit-detail';
import { ContactsDetailPage } from './../pages/contacts-detail/contacts';
import { VisitsPage } from "./../pages/visits/visits";
import { BudgetPage } from "./../pages/budget/budget";
import { ContactPage } from "./../pages/contacts/contacts";
import { CalendarPage } from "./../pages/calendar/calendar";
import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpModule, Http } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { Storage, IonicStorageModule } from "@ionic/storage";
import {BudgetList } from '../pages/budget-list/budget-list'

import { enableProdMode, LOCALE_ID } from "@angular/core";

import { Ng2FilterPipeModule, Ng2FilterPipe } from 'ng2-filter-pipe'

import { MyApp } from "./app.component";

import { SDKBrowserModule } from "../shared/sdk/index";

import { TabsPage } from "../pages/tabs/tabs";

import { LoginCustomPage } from "../pages/custom/login";
import { HomePage } from "../pages/home/home";

import { Api } from "../providers/api";
import { Items } from "../mocks/providers/items";
import { Settings } from "../providers/settings";
import { User } from "../providers/user";

import { Camera } from "@ionic-native/camera";
import { GoogleMaps } from "@ionic-native/google-maps";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { NgCalendarModule } from "ionic2-calendar";

import { Device } from "@ionic-native/device";
import { NativeStorage } from "@ionic-native/native-storage";

import { NativePageTransitions } from '@ionic-native/native-page-transitions';

import { AgmCoreModule } from '@agm/core'

import { CheckoutPage } from '../pages/checkout/checkout'
import { ProxyPage } from '../pages/proxy/proxy'

import { BatteryStatus } from '@ionic-native/battery-status';
import { Geolocation } from '@ionic-native/geolocation';


// The translate loader needs to know where to load i18n files
// in Ionic's static asset pipeline.
export function HttpLoaderFactory(http: Http) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: "Ionitron J. Framework",
    option3: "3",
    option4: "Hello"
  });
}

@NgModule({
  declarations: [
    MyApp,
    LoginCustomPage,
    TabsPage,
    HomePage,
    CalendarPage,
    ContactPage,
    BudgetPage,
    VisitsPage,
    ContactsDetailPage,
    VisitDetail,
    BudgetList,
    CheckoutPage,
    ProxyPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    Ng2FilterPipeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCK0jrU4FGv0RwUNJdS8NAnCWpLbcDbJD0'
    }),
    SDKBrowserModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [Http]
      }
    }),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    NgCalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginCustomPage,
    TabsPage,
    HomePage,
    CalendarPage,
    ContactPage,
    BudgetPage,
    VisitsPage,
    ContactsDetailPage,
    VisitDetail,
    BudgetList,
    CheckoutPage,
    ProxyPage
  ],
  providers: [
    Api,
    Items,
    User,
    Camera,
    GoogleMaps,
    SplashScreen,
    StatusBar,
    Device,
    NativeStorage,
    NativePageTransitions,
    Geolocation,
    BatteryStatus,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: LOCALE_ID, useValue: 'es-AR' }
  ]
})
export class AppModule {}

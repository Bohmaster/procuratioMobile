import { MainPage } from "./../pages/pages";
import { NativeStorage } from "@ionic-native/native-storage";
import { Component, ViewChild, NgZone } from "@angular/core";
import { Platform, Nav, Config, App, ToastController } from "ionic-angular";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { Device } from "@ionic-native/device";

import { FirstRunPage } from "../pages/pages";

import { LoopBackConfig, BASE_URL, API_VERSION } from "../shared/sdk";
import { LoopBackAuth } from "../shared/sdk/services/core/auth.service";

import { User, AccessToken } from "../shared/sdk/models";
import { UserApi } from "../shared/sdk/services/custom/User";

import { Settings } from "../providers/providers";

import { TranslateService } from "@ngx-translate/core";

import { Storage } from "@ionic/storage";

import { HttpClient, HttpParams } from "@angular/common/http";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  constructor(
    private translate: TranslateService,
    private platform: Platform,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private app: App,
    private auth: LoopBackAuth,
    private toast: ToastController,
    private user: UserApi,
    private device: Device,
    private storage: NativeStorage,
    private zone: NgZone,
    private http: HttpClient,
    settings: Settings
  ) {
    this.initTranslate();

    LoopBackConfig.setBaseURL(BASE_URL);
    LoopBackConfig.setApiVersion(API_VERSION);

    console.log("Inside App constructor");   

    this.checkCurrentUUID();

    this.app.viewDidEnter.subscribe(view => {
      const state_name = view.instance.constructor.name;
      console.log("Change", state_name);

      // if (current_user === null && state_name !== 'LoginCustomPage') {
      //   this.nav.push(LoginCustomPage);
      //   let toast = this.toast.create({
      //     message: 'Acceso denegado',
      //     duration: 3000,
      //     position: 'top'
      //   });
      //   toast.present();
      // } else if (current_user !== null && state_name == 'LoginCustomPage') {
      //     console.log('Logged in and in LoginPage', state_name);
      //     // this.nav.push(HomePage);
      // } else {
      //   this.user.getCurrent()
      //     .subscribe((user: User) => {
      //       console.log('User detected: ', user, current_user);
      //       this.currentUser = user;
      //     });
      // }
    });
  }

  ionViewDidLoad() {
    console.log("Yess!");
    this.platform.ready().then(() => {
      console.log("App Component entered. Ready");
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      console.log("La concha de tu madre");
    });
  }

  checkCurrentUUID() {
    console.log('Running checkCurrentUUID');
    let credentials = { uuid: this.device.uuid };
    this.http
      .post(`${BASE_URL}/api/proxy/handleUsers`, { credentials })
      .subscribe((data: { response }) => {
        console.log(data.response);

        if (data.response.id) {
          this.storage.setItem("currentUser", data.response).then(
            () => {
              console.log("Sabe currentUser");
              this.nav.push(MainPage);              
            },
            error => {
              console.log("CurrentUser", error);
            }
          );
        }
      });
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang("en");

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use("es"); // Set your language here
    }

    this.translate.get(["BACK_BUTTON_TEXT"]).subscribe(values => {
      this.config.set("ios", "backButtonText", values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

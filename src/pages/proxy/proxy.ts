import { BASE_URL } from "./../../shared/sdk/lb.config";
import { NativeStorage } from "@ionic-native/native-storage";
import { Component, NgZone } from "@angular/core";
import { NavController, ToastController, LoadingController, Events, App, Tabs } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient, HttpParams } from "@angular/common/http";

import { TranslateService } from "@ngx-translate/core";

import { UserApi } from "../../shared/sdk/services/custom/User";
import { LoopBackConfig } from "../../shared/sdk";
import { User, AccessToken } from "../../shared/sdk/models";
import { MainPage } from "../pages";
import { TabsPage } from "../tabs/tabs";

import { Device } from "@ionic-native/device";
import { LoginCustomPage } from "../custom/login";
// import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: "proxy",
  templateUrl: "login.html"
})
export class ProxyPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type

  // Our translated text strings
  private login: FormGroup;
  private signupErrorString: string;

  public uuid;
  public deviceInfo: any = "Devicess";
  private userId;

  constructor(
    public nav: NavController,
    public toast: ToastController,
    private spinner: LoadingController,
    private userService: UserApi,
    private formBuilder: FormBuilder,
    private nativeStorage: NativeStorage,
    private zone: NgZone,
    private http: HttpClient,
    private events: Events,
    private app: App,
    // private ns: NativeStorage,

    public device: Device
  ) {   
    // this.nativeStorage.setItem('myitem', {property: 'value', anotherProperty: 'anotherValue'})
    //   .then(
    //     () => {
    //       let toastWindow = this.toast.create({
    //         message: 'SetItem',
    //         duration: 3000,
    //         position: 'top'
    //       });
    //       console.log('Sabe SetItem')
    //     },
    //     error => {
    //       let toastWindow = this.toast.create({
    //         message: 'SetItem :' + error,
    //         duration: 3000,
    //         position: 'top'
    //       });
    //       console.log('SetItem', error);

    //     }
    //   );    
  }

    
  ionViewDidLoad() {
    console.log('PROXY', LoginCustomPage)
    setTimeout(() => {
      this.nav.push(LoginCustomPage)
    }, 200)
  }    

  go() {}
}

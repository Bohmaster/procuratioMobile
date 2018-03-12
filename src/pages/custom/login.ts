import { BASE_URL } from "./../../shared/sdk/lb.config";
import { NativeStorage } from "@ionic-native/native-storage";
import { Component, NgZone } from "@angular/core";
import { NavController, ToastController, LoadingController, Events, App } from "ionic-angular";
import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { HttpClient, HttpParams } from "@angular/common/http";

import { TranslateService } from "@ngx-translate/core";

import { UserApi } from "../../shared/sdk/services/custom/User";
import { LoopBackConfig } from "../../shared/sdk";
import { User, AccessToken } from "../../shared/sdk/models";
import { MainPage } from "../pages";
import { TabsPage } from "../tabs/tabs";

import { Device } from "@ionic-native/device";
// import { NativeStorage } from '@ionic-native/native-storage';

@Component({
  selector: "login-form",
  templateUrl: "login.html"
})
export class LoginCustomPage {
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
    this.login = this.formBuilder.group({
      username: ["", Validators.required],
      password: [""],
      uuid: [this.device.uuid]
    });

    this.checkCurrentUUID();

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

  checkCurrentUUID() {
    console.log('Running checkCurrentUUID', this.device);

    let credentials = { uuid: this.device.uuid };
    
    if (credentials.uuid === null) {
      console.log('crendtials null', credentials)
    } else {
      this.http
      .post(`${BASE_URL}/api/proxy/handleUsers`, { credentials })
      .subscribe((data: { response }) => {
        console.log('RESPONSE!', data.response);

        if (data.response.id) {
          this.userId = data.response.id;
          this.nativeStorage.setItem("currentUser", data.response).then(
            () => {
              console.log("Sabe currentUser");
              this.events.publish('user:loggedIn', data.response)
              this.nav.push(TabsPage);
            },
            error => {
              console.log("CurrentUser", error);
            }
          );
        }
      })
    }

    
      
  }

  goHome() {
    this.nav.push(TabsPage)
  }

  ionViewWillEnter() {
    this.nativeStorage.getItem("currentUser").then(
      data => {
        console.log("Fetched from storage login custom", data);
        if (data.id) {
          this.nav.push(TabsPage)
        }        
      },
      error => {
        console.log("GetItem", error);
      }
    );
  }

  logIn() {
    console.log("Loggin in with credentials: ", this.device, this.login);

    let loading = this.spinner.create({
      content: 'Cargando datos...'
    })

    loading.present()

    var credentials = this.login.value;

    this.http
      .post(`${BASE_URL}/api/proxy/handleUsers`, { credentials })
      .subscribe((data: { response }) => {
        console.log(data.response);

        if (data.response.id) {
          let toastWindow = this.toast.create({
                    message: 'Logueado exitosamente',
                    duration: 3000,
                    position: 'bottom'
                  });
          toastWindow.present();
          loading.dismiss();
          console.log('Sabe SetItem')
          this.nativeStorage.setItem("currentUser", data.response).then(
            () => {
              console.log("Sabe currentUser from login");
            },
            error => {
              console.log("CurrentUser", error);
            }
          );
          this.nav.push(MainPage);
        } else {
          loading.dismiss()
          let toastWindow = this.toast.create({
                    message: 'Ha surgido un error. Intente nuevamente',
                    duration: 3000,
                    position: 'bottom'
                  });
          toastWindow.present()
        }
      });

    // this.userService.login()
    //   .subscribe((token: AccessToken) => {
    //     console.log(token);

    //     this.nav.push(MainPage);
    //     let toast = this.toast.create({
    //       message: 'Logueado exitosamente',
    //       duration: 3000,
    //       position: 'top'
    //     });
    //     toast.present();
    //   });
  }

  go() {}
}

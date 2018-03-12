import { User } from "./../../shared/sdk/models/User";
import { ContactsDetailPage } from "./../contacts-detail/contacts";
import { NativeStorage } from "@ionic-native/native-storage";
import { Component } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";
import { Device } from "@ionic-native/device";


import { NavController, ToastController, App, LoadingController } from "ionic-angular";

import { LoopBackConfig, BASE_URL, API_VERSION } from "../../shared/sdk";

import * as moment from "moment";
import { first } from "rxjs/operators";

import { TabsPage } from '../tabs/tabs'


@Component({
  selector: "home-page",
  templateUrl: "home.html"
})
export class HomePage {
  currentUser;

  cantidadToday: number;
  cantidadTomorrow: number;
  events;
  list: Array<object>;
  uuid: any;
  firstTime: boolean;

  constructor(
    private nav: NavController,
    private toast: ToastController,
    private http: HttpClient,
    private nativeStorage: NativeStorage,
    private app: App,
    private spinner: LoadingController,
    private device: Device
  ) {
    console.log("HomePage mounted. CONSTRUCTOR");
    // this.loadEvents();
    this.currentUser = { asesor: { nombre: "" } };
    this.getCurrentUser();
    this.uuid = this.device.uuid;
    this.firstTime = true;
  }

  goToDetail(args) {
    console.log("TPPP", args);
    if (args.id) {
      this.app.getRootNav().push(ContactsDetailPage, { args });
    }
  }

  ionViewDidEnter() {
    console.log('About to enter HOME');
    this.loadEvents();
  }

  goHome() {
    this.nav.push(TabsPage)
  }

  getCurrentUser() {
    console.log("Running");
    this.nativeStorage.getItem("currentUser").then(
      user => {
        console.log("currentUserrrrrr", user, "JAPI", this);
        this.currentUser = user;
        // this.loadEvents();
        this.firstTime = false;
      },
      error => {
        console.log("CurrentUser", error);
      }
    );
  }

  loadEvents() {
    let loading = this.spinner.create({
      content: 'Cargando datos...'
    })
    loading.present()

    console.log("Running loadEventss()");
    const args = {
      asesorId: this.currentUser.asesor.id,
      today: true
    };

    this.http
      .post(`${BASE_URL}/api/proxy/getTodayEvents`, { args })
      .subscribe((data: { response }) => {
        console.log(data.response);
        this.events = data.response;
        this.cantidadToday = this.events[0].today[0].cantidadagendas;
        this.cantidadTomorrow = this.events[0].tomorrow[0].cantidadagendas;
        this.list = this.events[0].list;
        loading.dismiss()
      });
  }
}

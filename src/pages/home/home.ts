import { User } from "./../../shared/sdk/models/User";
import { ContactsDetailPage } from "./../contacts-detail/contacts";
import { NativeStorage } from "@ionic-native/native-storage";
import { Component } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";

import { NavController, ToastController, App } from "ionic-angular";

import { LoopBackConfig, BASE_URL, API_VERSION } from "../../shared/sdk";

import * as moment from "moment";

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

  constructor(
    private nav: NavController,
    private toast: ToastController,
    private http: HttpClient,
    private nativeStorage: NativeStorage,
    private app: App
  ) {
    console.log("HomePage mounted");
    this.loadEvents();
    this.currentUser = { asesor: { nombre: "" } };
    this.getCurrentUser();
  }

  goToDetail(args) {
    console.log("TPPP", args);
    if (args.id) {
      this.app.getRootNav().push(ContactsDetailPage, { args });
    }
  }

  getCurrentUser() {
    console.log("Running");
    this.nativeStorage.getItem("currentUser").then(
      user => {
        console.log("currentUserrrrrr", user.asesor, "JAPI", this);
        this.currentUser = user;
      },
      error => {
        console.log("CurrentUser", error);
      }
    );
  }

  loadEvents() {
    console.log("Running loadEventss()");
    const args = {
      asesorId: 116,
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
      });
  }
}

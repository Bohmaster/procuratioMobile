import { Component } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";

import { NavController, ToastController } from "ionic-angular";

import { LoopBackConfig, BASE_URL, API_VERSION } from "../../shared/sdk";

import * as moment from "moment";

@Component({
  selector: "visits-page",
  templateUrl: "visits.html"
})
export class VisitsPage {
  eventSource;
  viewTitle;

  events: any;
  todayDate = new Date();

  cantidadToday: number;
  cantidadTomorrow: number;
  list: Array<object>;

  constructor(
    private nav: NavController,
    private toast: ToastController,
    private http: HttpClient
  ) {
    console.log("HomePage mounted");
    this.loadEvents();
  }

  loadEvents() {
    console.log("Running loadEvents()");
    const args = {
      asesorId: 116,
      today: true
    };

    // this.http.post(`${BASE_URL}/api/proxy/get_today_events`, {args})
    //     .subscribe((data:{response}) => {
    //         console.log(data.response);
    //         this.events = data.response;
    //         this.cantidadToday = this.events[0].today[0].cantidadagendas;
    //         this.cantidadTomorrow = this.events[0].tomorrow[0].cantidadagendas;
    //         this.list = this.events[0].list;
    //     });
  }
}

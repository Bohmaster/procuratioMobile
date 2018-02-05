import { Component } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";

import { NavController, ToastController, NavParams } from "ionic-angular";

import { LoopBackConfig, BASE_URL, API_VERSION } from "../../shared/sdk";

import * as moment from "moment";

@Component({
  selector: "visit-detail",
  templateUrl: "visit-detail.html"
})
export class VisitDetail {

  toVisit;

  constructor(
    private nav: NavController,
    private toast: ToastController,
    private http: HttpClient,
    private navParams: NavParams
  ) {
    console.log("VisitDetail mounted");
    this.toVisit = this.navParams.data;
  }
   
}

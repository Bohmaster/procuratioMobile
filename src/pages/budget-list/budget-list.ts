import { Component } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";

import { NavController, ToastController, App } from "ionic-angular";

import { LoopBackConfig, BASE_URL, API_VERSION } from "../../shared/sdk";

import { Validators, FormBuilder, FormGroup } from "@angular/forms";


import * as moment from "moment";

@Component({
  selector: "budget-list-page",
  templateUrl: "budget-list.html"
})
export class BudgetList {
  eventSource;
  viewTitle;
  contacts;

  private contact: FormGroup; 

  constructor(
    private nav: NavController,
    private toast: ToastController,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private app: App
  ) {
    console.log("HomePage mounted");
    this.loadEvents();
    this.contact = this.formBuilder.group({
      filter: ["", Validators.required]
    });
  }

  itemSelected(item) {
    console.log("Item selected", item);
  }

  // goToDetail(args) {
  //   console.log("TPPP", args);
  //   if (args.id) {
  //     this.app.getRootNav().push(ContactsDetailPage, { args });
  //   }
  // }

  loadEvents() {
    console.log("Running loadEvents()", "SABEEEEE");
    const args = {
      asesorId: 116,
      today: true
    };

    this.http
      .post(`${BASE_URL}/api/proxy/getBudgetWalls`, { args })
      .subscribe((data: { response }) => {
        console.log(data.response);
        this.contacts = data.response;
        this.contacts.push(data.response[0]);
      });
  }
}

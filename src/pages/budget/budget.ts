import { Component } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";

import { NavController, ToastController, App } from "ionic-angular";

import { LoopBackConfig, BASE_URL, API_VERSION } from "../../shared/sdk";

import { Validators, FormBuilder, FormGroup } from "@angular/forms";

import BudgetListPage from '../budget-list/budget-list';


import * as moment from "moment";

@Component({
  selector: "budget-page",
  templateUrl: "budget.html"
})
export class BudgetPage {
  eventSource;
  viewTitle;
  contacts;
  budget: FormGroup; 

  constructor(
    private nav: NavController,
    private toast: ToastController,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private app: App
  ) {
    this.loadEvents();
    this.budget = this.formBuilder.group({
      filter: ["", Validators.required]
    });
  }

  itemSelected(item) {
    console.log("Item selected", item);
  }

  goToDetail(args) {
    console.log("TPPP", args);
    if (args.id) {
      this.app.getRootNav().push(BudgetListPage, { args });
    }
  }

  loadEvents() {
    console.log("Running loadEvents()", "SABEEEEE");
    const args = {
      userId: 118,
      today: true
    };

    this.http
      .post(`${BASE_URL}/api/proxy/getBudgets`, { args })
      .subscribe((data: { response }) => {
        console.log(data.response);
        this.contacts = data.response;
        this.contacts.push(data.response[0]);
      });
  }
}
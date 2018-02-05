import { Component } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";

import { NavController, ToastController } from "ionic-angular";

import { LoopBackConfig, BASE_URL, API_VERSION } from "../../shared/sdk";

import * as moment from "moment";
import { NavParams } from "ionic-angular/navigation/nav-params";

@Component({
  selector: "contact-detail-page",
  templateUrl: "contacts-detail.html"
})
export class ContactsDetailPage {
  apellido = "Ramiro";
  nombre   = "Trovant";

  contacto: object;

  inputBuilder = [];

  data = "";

  constructor(
    private nav: NavController,
    private navParams: NavParams,
    private toast: ToastController,
    private http: HttpClient
  ) {
    console.log("ContactDetailPage mounted");
    console.log(this.navParams, 'MERCA');
    this.getContact();
    this.data = this.navParams.data.args.id + ' / ' + this.navParams.data.args.name
  }

  getContact = function() {
    console.log('Running getContact()');
    const args = {
      codigo: this.navParams.data.args.id
    }

    this.http
    .post(`${BASE_URL}/api/proxy/handleContacts`, { args })
    .subscribe((data: { response }) => {
      console.log(data.response);
      this.contacto = data.response;

      Object.keys(this.contacto).forEach((key, index) => {
        let prop = {};        
        prop = {key: key, value: this.contacto[key]}
        this.inputBuilder.push(prop);
      })
      
      console.log(this.inputBuilder);
    });
  }

}

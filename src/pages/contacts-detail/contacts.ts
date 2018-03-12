import { Component } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";

import { NavController, ToastController, LoadingController } from "ionic-angular";

import { LoopBackConfig, BASE_URL, API_VERSION } from "../../shared/sdk";

import * as moment from "moment";
import { NavParams } from "ionic-angular/navigation/nav-params";
import { TabsPage } from '../tabs/tabs'

@Component({
  selector: "contact-detail-page",
  templateUrl: "contacts-detail.html"
})
export class ContactsDetailPage {
  apellido = "Ramiro";
  nombre   = "Trovant";

  contacto = {}

  inputBuilder = [];

  data = "";

  constructor(
    private nav: NavController,
    private navParams: NavParams,
    private toast: ToastController,
    private http: HttpClient,
    private spinner: LoadingController
  ) {
    console.log("ContactDetailPage mounted");
    console.log(this.navParams, 'MERCA');
    this.getContact();
    if (this.navParams.data.args.name) {
      this.data = this.navParams.data.args.id + " - " + this.navParams.data.args.name;
    } else {
      this.data = this.navParams.data.args.item;
    }
  }

  goHome() {
    this.nav.push(TabsPage)
  }

  getContact = function() {
    console.log('Running getContact()');
    const args = {
      contactoId: this.navParams.data.args.contactoId
    }

    let loading = this.spinner.create({
      content: 'Cargando datos...'
    })

    loading.present()

    this.http
    .post(`${BASE_URL}/api/proxy/getContactDetail`, { args })
    .subscribe((data: { response }) => {
      console.log(data.response);
      this.contacto = data.response[0];
      loading.dismiss()

      // Object.keys(this.contacto).forEach((key, index) => {
      //   let prop = {};        
      //   prop = {key: key, value: this.contacto[key]}
      //   this.inputBuilder.push(prop);
      // })
      
      // console.log(this.inputBuilder);
    });
  }

}

import { Component } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";

import { NavController, ToastController, App, LoadingController } from "ionic-angular";

import { LoopBackConfig, BASE_URL, API_VERSION } from "../../shared/sdk";

import { Validators, FormBuilder, FormGroup } from "@angular/forms";
import { NativeStorage } from "@ionic-native/native-storage";


import * as moment from "moment";
import { ContactsDetailPage } from "../contacts-detail/contacts";
import { TabsPage } from '../tabs/tabs'

@Component({
  selector: "contact-page",
  templateUrl: "contacts.html"
})
export class ContactPage {
  eventSource;
  viewTitle;
  contacts = [];
  filter;

  private contact: FormGroup; 

  constructor(
    private nav: NavController,
    private toast: ToastController,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private app: App,
    private storage: NativeStorage,
    private spinner: LoadingController

  ) {
    console.log("ContactPage constructor");
    // this.loadEvents();
    this.filter = {
      nombre: ''
    }
  }

  itemSelected(item) {
    console.log("Item selected", item);
  }

  ionViewDidEnter() {
    console.log('Entered ContactPage')
    this.loadEvents();
  }

  goToDetail(args) {
    console.log("TPPP", args);
    if (args) {
      this.app.getRootNav().push(ContactsDetailPage, { args });
    }
  }

  goHome() {
    this.nav.push(TabsPage)
  }

  loadEvents() {
    console.log("Running loadEvents()");
    const loading = this.spinner.create({
      content: "Cargando contactos"
    })
    loading.present();
    this.storage.getItem("currentUser").then(
      user => {
        const args = {
          asesorId: user.asesor.id,
          today: true
        }
        this.http
          .post(`${BASE_URL}/api/proxy/getContacts`, { args })
          .subscribe((data: { response }) => {
            console.log('Response from: ', data.response);
            loading.dismiss();
            for (let key in data.response) {
              console.log();
              let filteredObj = data.response[key];
              filteredObj.nombre =  filteredObj.codigo + " - " + filteredObj.nombre;
              // console.log(filteredObj);
              this.contacts.push(filteredObj);
            }
          });
      },
      error => {
        console.log("CurrentUser", error);
        loading.dismiss()
      }
    );

    
  }
}

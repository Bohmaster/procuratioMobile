import { Component } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";

import { NavController, ToastController, App, LoadingController } from "ionic-angular";

import { LoopBackConfig, BASE_URL, API_VERSION } from "../../shared/sdk";

import { Validators, FormBuilder, FormGroup } from "@angular/forms";

import { TabsPage } from '../tabs/tabs'

import * as moment from "moment";
import { NativeStorage } from "@ionic-native/native-storage";

@Component({
  selector: "budget-page",
  templateUrl: "budget.html"
})
export class BudgetPage {
  eventSource;
  viewTitle;
  contacts = [];
  filter;

  constructor(
    private nav: NavController,
    private toast: ToastController,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private app: App,
    private spinner: LoadingController,
    private storage: NativeStorage
  ) {
    console.log('Construtor Budget')
    this.filter = {
      nombre: ''
    }
  }

  goHome() {
    this.nav.push(TabsPage)
  }

  itemSelected(item) {
    console.log("Item selected", item);
  }

  // goToDetail(args) {
  //   console.log("TPPP", args);
  //   if (args.id) {
  //     this.app.getRootNav().push(BudgetListPage, { args });
  //   }
  // }

  ionViewDidEnter() {
    this.loadEvents();
  }

  loadEvents() {
    console.log("Running loadEvents()", "SABEEEEE");
    const loading = this.spinner.create({
      content: "Cargando contactos"
    })
    loading.present();
    this.storage.getItem("currentUser").then(
      user => {
        const args = {
          asesorId: user.asesor.id
        }
        this.http
          .post(`${BASE_URL}/api/proxy/getBudgets`, { args })
          .subscribe((data: { response }) => {
            console.log(data.response);
            loading.dismiss();
            for (let key in data.response) {
              console.log();
              let filteredObj = data.response[key];
              filteredObj.nombre =  filteredObj.numero + " - " + filteredObj.nombre;
              console.log(filteredObj);
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


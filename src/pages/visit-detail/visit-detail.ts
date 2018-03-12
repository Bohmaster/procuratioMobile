import { Component, NgZone, ApplicationRef, OnInit } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";
import { NativeStorage } from "@ionic-native/native-storage";

import { NavController, ToastController, NavParams, AlertController, App, LoadingController } from "ionic-angular";

import { LoopBackConfig, BASE_URL, API_VERSION } from "../../shared/sdk";

import * as moment from "moment";

import { MapsAPILoader } from '@agm/core'

import { } from '@types/googlemaps';

import { CheckoutPage } from '../checkout/checkout'

import { TabsPage } from '../tabs/tabs'

declare var google: any;

@Component({
  selector: "visit-detail",
  templateUrl: "visit-detail.html",
  styles: [
    `
    agm-map {
      height: 200px;
    }
  `
  ]
})
export class VisitDetail implements OnInit {

  toVisit;

  lat; 
  lng;

  constructor(
    private nav: NavController,
    private toast: ToastController,
    private http: HttpClient,
    private navParams: NavParams,
    private maps: MapsAPILoader,
    public _ngZone: NgZone,
    private appRef: ApplicationRef,
    private alert: AlertController,
    private app: App,
    private spinner: LoadingController,
    private storage: NativeStorage
  ) {
    //console.log("VisitDetail mounted");
    this.toVisit = this.navParams.data.element;
    this.toVisit.horario = this.toVisit.horario.substring(5,0)
    //console.log(this.navParams)
  }

  ngOnInit() {
   
  }

  goHome() {
    this.nav.push(TabsPage)
  }
  
  getMapInfo () {
    //console.log('Running map info')
    this.maps.load().then(() => {
      let loading = this.spinner.create({
        content: 'Cargando datos...'
      })
      loading.present()
      //console.log('script gm loaded')
      const geocoder = new google.maps.Geocoder()
      //console.log(geocoder);

      geocoder.geocode({ 'address': this.toVisit.direccion }, (results, status) => {
        if (status == 'OK') {
          //console.log(results)

          this._ngZone.run(() => {
            this.lat = results[0].geometry.location.lat()
            this.lng = results[0].geometry.location.lng()
            //console.log(this);
            loading.dismiss()
          })


        } else {
          //console.log('Geocode was not successful for the following reason: ' + status);
          loading.dismiss()
        }
      });
    })
  }

  ionViewDidEnter() {
    console.log('View did enter', 'VisitPage')
   if (this.toVisit.visit) {
      this.checkIfCheckedIn(); 
   } else {
      this.getMapInfo();
   }
  }

  checkIfCheckedIn() {
    let loading = this.spinner.create({
      content: 'Corroborando checkin'
    })

    loading.present()
    this.http
      .post(`${BASE_URL}/api/proxy/checkIfCheckedIn`, {
        args: {
          agendaId: this.toVisit.id
        }
      })
      .subscribe((data: { response }) => {
        //console.log(data.response);

        if (data.response.length > 0) {
          //console.log('LENGHTTT', data.response.length)
          loading.dismiss();
          this.app.getRootNav().push(CheckoutPage, {
            current: this.toVisit,
            source: this.navParams.data.source
          }).then(function() {
            //console.log('HIJO DE PUTA')
          })          
        } else {
          //console.log('LA CONCHA DE TU MADRE')
          loading.dismiss(); 
          this.getMapInfo();
        }
      });
  }

  doCheckinConfirmed() {
    let loading = this.spinner.create({
      content: 'Haciendo checkin'
    })
    loading.present()

    this.storage.getItem("currentUser").then(
      (currentUser) => {
        //console.log("Sabe currentUser", currentUser);
        this.http
        .post(`${BASE_URL}/api/proxy/doCheckin`, {
          args: {
            agendaId: this.toVisit.id,
            asesorId: currentUser.id
          }
        })
        .subscribe((data: { response }) => {
          //console.log('plz', data.response);
          loading.dismiss();
          this.app.getRootNav().push(CheckoutPage, {
            current: this.toVisit,
            source: this.navParams.data.source
          });
          //console.log('WHY=?')
        });
      },
      error => {
        //console.log("CurrentUser", error);
      }
    );


   
  }

  doCheckin(arg) {
    let confirm = this.alert.create({
      title: 'CHECKIN',
      message: 'Estàs seguro que deseas hacer el checkin?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            //console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            //console.log('Agree clicked');
            // this.toVisit.coord = {
            //   lat: this.lat,
            //   lng: this.lng
            // }

            this.doCheckinConfirmed()
          }
        }
      ]
    });
    confirm.present();
  }
}

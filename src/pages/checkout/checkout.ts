import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";

import { NavController, ToastController, NavParams, AlertController, LoadingController, App } from "ionic-angular";

import { Observable } from 'rxjs/Rx'

import { LoopBackConfig, BASE_URL, API_VERSION } from "../../shared/sdk";
import { NativeStorage } from "@ionic-native/native-storage";

import { VisitDetail } from '../visit-detail/visit-detail';
import { VisitsPage } from '../visits/visits' 
import { TabsPage } from '../tabs/tabs'

@Component({
  selector: "checkout-page",
  templateUrl: "checkout.html",
  styles: [
    `
    agm-map {
      height: 100px;
    }
  `
  ]
})
export class CheckoutPage implements OnInit {
  item: any;

  done = false;
  questions;
  answers;
  async = [];

  constructor(
    private nav: NavController,
    private toast: ToastController,
    private http: HttpClient,
    private navParams: NavParams,
    private alert: AlertController,
    private spinner: LoadingController,
    private nativeStorage: NativeStorage,
    private app: App
  ) {
    console.log("CheckoutDetail mounted");
    this.answers = [];
    this.questions = [];
    this.item = this.navParams.data.current;
    console.log(Observable)
  }

  ngOnInit() {
       console.log('LA CONCHA DE TU MADRE')
       console.log(this.navParams)      
       this.listQuestions();
  }

  listQuestions() {
    const spinner = this.spinner.create({
      content: 'Cargando preguntas'
    })
    spinner.present();
    this.http
      .post(`${BASE_URL}/api/proxy/listQuestions`, {})
      .subscribe((data: { response }) => {   
        console.log(data.response)
        this.questions = data.response;

        this.questions.map(q => {
          this.getAnswers(q.id, (answers) => {
            console.log('Inside callback', answers)
            q.answers = answers
            console.log(this.questions)
          })
        })
        spinner.dismiss();
      });
  }

  goHome() {
    this.nav.push(TabsPage)
  }

  getMagic(val) {
    console.log('MODEL CHANGE', val);
    let array = [];

    array = val.split(",")
    console.log(array);

    const c = {
      value: array[0],
      id: array[1],
      qId: array[2]
    }

    let yatsee = false;

    if (this.answers.length === 0) {
      console.log('VACIO!')
      this.answers.push(c)
      console.log(this.answers)
    } else {
      for (var i = 0; i < this.answers.length; i++) {
        console.log('pre', i)
        var curr = this.answers[i]
        if (c.qId === curr.qId) {
          console.log('son iguales', c, curr)
          this.answers[i] = c;
          yatsee = false;
          console.log(curr)
        } else {
          yatsee = true
        }
        
        if (i === this.answers.length - 1) {
          console.log('last iteration', c, curr)
          if (c.qId !== curr.qId && yatsee) {
            this.answers.push(c)
          }
        }
      }
      console.log(this.answers)
   }
 }

 saveAnswers() {
  const spinner = this.spinner.create({
    content: 'Guardando respuestas'
  })
  spinner.present();
  this.nativeStorage.getItem("currentUser").then(
    user => {
      console.log('get user', user);
      let arrayOfObs = [];
      this.answers.map(element => {
        console.log(element);
        const observable = this.http
          .post(`${BASE_URL}/api/proxy/saveAnswers`, {
            args: {
              vendedorId: user.id,
              preguntaId: element.qId,
              respuestaId: element.id,
              agendaId: this.item.id
            }
          })
          // .subscribe((data: { response }) => {   
          //   console.log('GREAT!', data.response)
          // });
        
        arrayOfObs.push(observable)  
          
      })

      let source = Observable.combineLatest(arrayOfObs)
      var subscription = source.subscribe(
        x => console.log(`onNext:`, x),
        e => console.log(`onError:`, e),
        () => {
          console.log('onCompleted')
          spinner.dismiss()
          const loading = this.spinner.create({
            content: 'Finalizando checkout'
          })
          loading.present();
          this.http
          .post(`${BASE_URL}/api/proxy/doCheckOut`, {
            args: {
              agendaId: this.item.id
            }
          })
          .subscribe((data: { response }) => {   
            console.log('GREAT!', data.response)
            loading.dismiss();
            this.done = true;
            console.log('FINALLAY', this.navParams.data)
          });
        });

    },
    error => {
      console.log("CurrentUser", error);
    }
  );
  
  // while (this.async < this.questions.length) {
  //   setTimeout(function() {
  //     console.log(this.async, this.questions.lenght)
  //   }, 1000)
  // }

  
 }
 
 checkAnswersSaved($event) {
  console.log($event)
 }

  getAnswers(qId, cb) {
    this.http
      .post(`${BASE_URL}/api/proxy/getAnswers`, {
        args: {
          preguntaId: qId
        }
      })
      .subscribe((data: { response }) => {   
        console.log(data.response)
        cb(data.response)
      });
  }

  doCheckout(arg) {
    let confirm = this.alert.create({
      title: 'CHECKOUT',
      message: 'Estàs seguro que deseas hacer el checkout?',
      buttons: [
        {
          text: 'Cancelar',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            console.log('Agree clicked');
            this.saveAnswers()
          }
        }
      ]
    });
    confirm.present();
  }

  wtf() {
    let array = this.navParams.data.source;
    console.log('======', array)
    if (array !== undefined) {
      console.log(1,array)
      array.shift();
      console.log(2,array)
      if (array.length === 0) {
        this.nav.push(VisitsPage)
      } else {
        let e = array[0];
        e.visit = true;
        this.app.getRootNav().push(VisitDetail, {
          element: e,
          source: array
        });
      }
    } else {
      this.nav.push(VisitsPage)
    }
    
  }
}



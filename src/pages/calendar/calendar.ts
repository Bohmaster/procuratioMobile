import { Component, ViewChild } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";

import { NavController, ToastController, App, LoadingController } from "ionic-angular";
import { NativeStorage } from "@ionic-native/native-storage";

import { LoopBackConfig, BASE_URL, API_VERSION } from "../../shared/sdk";

import * as moment from "moment";
import { VisitDetail } from "../visit-detail/visit-detail";
import { TabsPage } from '../tabs/tabs'

@Component({
  selector: "calendar-page",
  templateUrl: "calendar.html",

})
export class CalendarPage {
  eventSource;
  viewTitle;
  eventSourceFix;

  defaultEvents = "No hay eventos";

  events: any;

  firstTime = true;

  months = new Array(
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  );
  todayDate = new Date();
  merca = 'merca';
  toShowDate = new Date().toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  todayMonth = this.months[this.todayDate.getMonth()];

  isToday: boolean;

  currentUser = {
    crmAsesorTecnicoId: ''
  };

  constructor(
    private nav: NavController,
    private toast: ToastController,
    private http: HttpClient,
    private nativeStorage: NativeStorage,
    private app: App,
    private spinner: LoadingController,
    private storage: NativeStorage
  ) {
    console.log("CalendarPage mounted");
    // this.nativeStorage.getItem("currentUser").then(
    //   (user) => {
    //     console.log("currentUserrrrrr from CALENDAR", user.asesor, 'JAPI', this);
    //     this.currentUser = user;
    //     this.loadEvents();
    //   },
    //   error => {io
    //     console.log("CurrentUser", error);
    //   }
    // );
    console.log('Running inside constructor loadEvents()')
    // this.loadEvents(false);
  }

  calendar = {
    mode: "month",
    currentDate: new Date(),
    dateFormatter: {
      formatMonthViewDay: function (date: Date) {
        return date.getDate().toString();
      },
      formatMonthViewDayHeader: function (date: Date) {
        return "MonMH";
      },
      formatMonthViewTitle: function (date: Date) {
        return "testMT";
      },
      formatWeekViewDayHeader: function (date: Date) {
        return "MonWH";
      },
      formatWeekViewTitle: function (date: Date) {
        return "testWT";
      },
      formatWeekViewHourColumn: function (date: Date) {
        return "testWH";
      },
      formatDayViewHourColumn: function (date: Date) {
        return "testDH";
      },
      formatDayViewTitle: function (date: Date) {
        return "testDT";
      }
    }
  };

  goHome() {
    this.nav.push(TabsPage)
  }

  changeMonth(event, type) {
    console.log(event);

    if (type === "next") {
      this.calendar.currentDate = new Date(
        this.calendar.currentDate.getFullYear(),
        this.calendar.currentDate.getMonth() + 1,
        1
      );
      this.toShowDate = this.calendar.currentDate.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    } else {
      this.calendar.currentDate = new Date(
        this.calendar.currentDate.getFullYear(),
        this.calendar.currentDate.getMonth() - 1,
        1
      );
      this.toShowDate = this.calendar.currentDate.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }
  }

  reloadSource(a, b) {
    console.log('JAJAJAJA?')
  }

  ionViewDidEnter() {
    console.log('About to load, VisitsComponent');
    this.loadEvents(false);
  }

  setCurrentDate(event) {
    this.calendar.currentDate = new Date();
    this.toShowDate = this.calendar.currentDate.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  loadEvents(day?) {
    let loading = this.spinner.create({
      content: 'Cargando datos...'
    })

    loading.present()
    if (!day) {
      var merca = new Date().toISOString().slice(0, 10).replace('T', ' ');
      day = new Date().toLocaleDateString().slice(0, 10).replace('T', ' ');
      console.log(day, merca);
    }

    console.log('EL DIA ES', day, new Date().toLocaleDateString());

    let events = [];

    this.storage.getItem("currentUser").then(
      user => {
        console.log("Running loadEvents()");
        const args = {
          asesorId: user.asesor.id,
          selectedDay: day
        }
        console.log(args);
        this.http
          .post(`${BASE_URL}/api/proxy/fillCalendar`, { args })
          .subscribe((data: { response }) => {
            this.eventSourceFix = data.response;
            this.defaultEvents = "Se han encontrado " + data.response.length + " eventos";
            console.log(this.eventSourceFix);
            loading.dismiss()
          });
      },
      error => {
        console.log("CurrentUser", error);
      }
    );

  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onEventSelected(event) {
    console.log(
      "Event selected:" +
      event.startTime +
      "-" +
      event.endTime +
      "," +
      event.title
    );
  }

  changeMode(mode) {
    this.calendar.mode = mode;
  }

  today() {
    this.calendar.currentDate = new Date();
    this.toShowDate = this.calendar.currentDate.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  onTimeSelected(ev) {
    const formattedDay = ev.selectedTime.toISOString().slice(0, 10).replace('T', ' ');
    console.log(
      "Selected times: " +
      ev.selectedTime.toISOString().slice(0, 10).replace('T', ' ') +
      ", hasEvents: " +
      (ev.events !== undefined && ev.events.length !== 0) +
      ", disabled: " +
      ev.disabled
    );
    this.loadEvents(formattedDay)
  }

  onChange(ev) {
    console.log(ev);
    const formattedDay = ev.selectedTime.toISOString().slice(0, 10).replace('T', ' ');
    // this.loadEvents(formattedDay);    
  }

  onCurrentDateChanged(event: Date) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    event.setHours(0, 0, 0, 0);
    this.isToday = today.getTime() === event.getTime();
    console.log(event);
    this.toShowDate = event.toLocaleDateString('es-AR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    this.loadEvents(event.toISOString().slice(0, 10).replace('T', ' '));

  }

  goToVisit(e, source) {
    e.visit = false;
    if (e) {
      this.app.getRootNav().push(VisitDetail, {
        element: e,
        source: source
      });
    }
  }

  // createRandomEvents() {
  //   var events = [];
  //   for (var i = 0; i < 50; i += 1) {
  //     var date = new Date();
  //     var eventType = Math.floor(Math.random() * 2);
  //     var startDay = Math.floor(Math.random() * 90) - 45;
  //     var endDay = Math.floor(Math.random() * 2) + startDay;
  //     var startTime;
  //     var endTime;
  //     if (eventType === 0) {
  //       startTime = new Date(
  //         Date.UTC(
  //           date.getUTCFullYear(),
  //           date.getUTCMonth(),
  //           date.getUTCDate() + startDay
  //         )
  //       );
  //       if (endDay === startDay) {
  //         endDay += 1;
  //       }
  //       endTime = new Date(
  //         Date.UTC(
  //           date.getUTCFullYear(),
  //           date.getUTCMonth(),
  //           date.getUTCDate() + endDay
  //         )
  //       );
  //       events.push({
  //         title: "All Day - " + i,
  //         startTime: startTime,
  //         endTime: endTime,
  //         allDay: true
  //       });
  //     } else {
  // var startMinute = Math.floor(Math.random() * 24 * 60);
  // var endMinute = Math.floor(Math.random() * 180) + startMinute;
  // startTime = new Date(
  //   date.getFullYear(),
  //   date.getMonth(),
  //   date.getDate() + startDay,
  //   0,
  //   date.getMinutes() + startMinute
  // );
  // endTime = new Date(
  //   date.getFullYear(),
  //   date.getMonth(),
  //   date.getDate() + endDay,
  //   0,
  //   date.getMinutes() + endMinute
  // );
  //       events.push({
  //         title: "Event - " + i,
  //         startTime: startTime,
  //         endTime: endTime,
  //         allDay: false
  //       });
  //     }
  //   }
  //   return events;
  // }

  onRangeChanged(ev) {
    console.log(
      "range changed: startTime: " + ev.startTime + ", endTime: " + ev.endTime
    );
  }

  markDisabled = (date: Date) => {
    var current = new Date();
    current.setHours(0, 0, 0);
    return date < current;
  };
}

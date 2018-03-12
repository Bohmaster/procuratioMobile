import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";

import { NativePageTransitions, NativeTransitionOptions } from '@ionic-native/native-page-transitions';

import { Tab1Root } from "../pages";
import { Tab2Root } from "../pages";
import { Tab3Root } from "../pages";
import { Tab4Root } from "../pages";
import { Tab5Root } from "../pages";

@Component({
  selector: "page-tabs",
  templateUrl: "tabs.html"
})
export class TabsPage {
  tab1Root: any = Tab1Root;
  tab2Root: any = Tab2Root;
  tab3Root: any = Tab3Root;
  tab4Root: any = Tab4Root;
  tab5Root: any = Tab5Root;

  tab1Title = "Inicio";
  tab2Title = "Contactos";
  tab3Title = "Agenda";
  tab4Title = "Visitas";
  tab5Title = "Presup.";

  loaded:   boolean = false;
  tabIndex: number  = 0;

  constructor(
    public navCtrl: NavController,
    public translateService: TranslateService,
    private nativePageTransitions: NativePageTransitions
  ) {
    // translateService.get(['TAB1_TITLE', 'TAB2_TITLE', 'TAB3_TITLE']).subscribe(values => {
    //   this.tab1Title = values['TAB1_TITLE'];
    //   this.tab2Title = values['TAB2_TITLE'];
    //   this.tab3Title = values['TAB3_TITLE'];
    // });
  }

  private getAnimationDirection(index):string {
    var currentIndex = this.tabIndex;

    this.tabIndex = index;

    switch (true){
      case (currentIndex < index):
        return('left');
      case (currentIndex > index):
        return ('right');
    }
  }

  public transition(e):void {    
    let options: NativeTransitionOptions = {
     direction: 'up',
     duration: 250,
     slowdownfactor: -1,
     slidePixels: 0,
     iosdelay: 20,
     androiddelay: 0,
     fixedPixelsTop: 0,
     fixedPixelsBottom: 48
    };

    if (!this.loaded) {
      this.loaded = true;
      return;
    }

    this.nativePageTransitions.slide(options);
  }
}

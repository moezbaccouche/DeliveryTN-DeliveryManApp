import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse,
  BackgroundGeolocationEvents,
} from "@ionic-native/background-geolocation/ngx";
import { DeliveryInfoService } from "./services/delivery-info.service";

declare var window;

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  locations: any;
  deliveryManId = 1;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private backgroundGeolocation: BackgroundGeolocation,
    private deliveryInfoService: DeliveryInfoService
  ) {
    this.initializeApp();
    this.locations = [];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      if (this.platform.is("android")) {
        this.statusBar.overlaysWebView(false);
        this.statusBar.styleLightContent();
      }
      console.log(new Date());
      const config: BackgroundGeolocationConfig = {
        desiredAccuracy: 10,
        stationaryRadius: 1,
        distanceFilter: 1,
        notificationText: "Commande en cours de livraison",
        interval: 5000,
        debug: false, //  enable this hear sounds for background-geolocation life-cycle.
        stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      };

      //Uncomment the following lines when the app is nearly finished

      //   this.backgroundGeolocation.configure(config).then(() => {
      //     this.backgroundGeolocation
      //       .on(BackgroundGeolocationEvents.location)
      //       .subscribe((location: BackgroundGeolocationResponse) => {
      //         //Call the api service to update currentLocation

      //         this.deliveryInfoService
      //           .updateCurrenLocation(
      //             location.latitude,
      //             location.longitude,
      //             this.deliveryManId
      //           )
      //           .subscribe(
      //             () => {},
      //             (error) => {
      //               console.log(error);
      //             }
      //           );
      //       });
      //   });
      //   window.app = this;
    });
  }
}

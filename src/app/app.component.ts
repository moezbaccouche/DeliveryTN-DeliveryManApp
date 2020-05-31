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
import { OneSignal } from "@ionic-native/onesignal/ngx";
import { Router } from "@angular/router";

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
    private deliveryInfoService: DeliveryInfoService,
    private oneSignal: OneSignal,
    private router: Router
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

      if (this.platform.is("cordova")) {
        this.setupPush();
      }

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

  setupPush() {
    this.oneSignal.startInit(
      "4d92a6e0-c0bb-42b6-8bf1-01be7bc90286",
      "636537591278"
    );

    this.oneSignal.inFocusDisplaying(
      this.oneSignal.OSInFocusDisplayOption.None
    );

    this.oneSignal.handleNotificationReceived().subscribe((data) => {});

    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      this.router.navigate(["/tabs"]);
    });
    this.oneSignal.endInit();
  }
}

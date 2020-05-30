import { Component, OnInit } from "@angular/core";
import { OrderService } from "../services/order.service";
import { Subscription } from "rxjs";
import { DeliveryManService } from "../services/delivery-man.service";
import { ToastController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";

declare var window;
@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page implements OnInit {
  etoiles = new Array(5);

  inDeliveryOrdersSubscription: Subscription;
  inDeliveryOrders = [];

  deliveryManId = 1;
  isLoading = true;

  deliveryMan;
  deliveryManSubscription: Subscription;

  starOne = 0;
  starTwo = 0;
  starThree = 0;
  starFour = 0;
  starFive = 0;

  constructor(
    private orderService: OrderService,
    private deliveryManService: DeliveryManService,
    private toastController: ToastController,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getInDeliveryOrders();
    this.inDeliveryOrdersSubscription = this.orderService.inDeliveryOrdersSubject.subscribe(
      (orders: any) => {
        this.inDeliveryOrders = orders;

        //Uncomment these lines when the app is nearly finished

        // if (this.inDeliveryOrders.length > 0) {
        //   this.startBackgroundTracking();
        // } else {
        //   this.stopBackgroundTracking();
        // }
      }
    );
    this.orderService.emitInDeliveryOrdersSubject();

    this.getDeliveryMan();
    this.deliveryManSubscription = this.deliveryManService.delivmanSubject.subscribe(
      (data) => {
        this.deliveryMan = data;
      }
    );
    this.deliveryManService.emitDeliveryManSubject();
  }

  getDeliveryMan() {
    this.deliveryManService.getDelivMan(this.deliveryManId).then(
      () => {
        this.isLoading = false;
        this.initRatingStars();
      },
      (error) => {
        this.presentToast("Une erreur est survenue !", "danger");
        console.log(error);
      }
    );
  }

  getInDeliveryOrders() {
    this.orderService
      .getDeliveryManInDeliveryOrders(this.deliveryManId)
      .then(() => {
        this.isLoading = false;
      });
  }

  startBackgroundTracking() {
    window.app.backgroundGeolocation.start();
  }

  stopBackgroundTracking() {
    window.app.backgroundGeolocation.stop();
  }

  initRatingStars() {
    if (this.deliveryMan.rating >= 0 && this.deliveryMan.rating < 1) {
      this.starOne = 0.5;
    }
    if (this.deliveryMan.rating >= 1 && this.deliveryMan.rating < 2) {
      this.starOne = 1;
      this.starTwo = 0.5;
    }
    if (this.deliveryMan.rating >= 2 && this.deliveryMan.rating < 3) {
      this.starOne = 1;
      this.starTwo = 1;
      this.starThree = 0.5;
    }
    if (this.deliveryMan.rating >= 3 && this.deliveryMan.rating < 4) {
      this.starOne = 1;
      this.starTwo = 1;
      this.starThree = 1;
      this.starFour = 0.5;
    }
    if (this.deliveryMan.rating >= 4 && this.deliveryMan.rating < 5) {
      this.starOne = 1;
      this.starTwo = 1;
      this.starThree = 1;
      this.starFour = 1;
      this.starFive = 0.5;
    }
    if (this.deliveryMan.rating == 5) {
      this.starOne = 1;
      this.starTwo = 1;
      this.starThree = 1;
      this.starFour = 1;
      this.starFive = 1;
    }
  }

  async presentToast(msg: string, type: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: "toastCart",
      color: type,
    });
    toast.present();
  }
}

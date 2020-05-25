import { Component, OnInit } from "@angular/core";
import { OrderService } from "src/app/services/order.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { ToastController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";

declare var window;

@Component({
  selector: "app-order-summary",
  templateUrl: "./order-summary.page.html",
  styleUrls: ["./order-summary.page.scss"],
})
export class OrderSummaryPage implements OnInit {
  orderId;
  order;

  inDeliveryOrdersSubscription: Subscription;
  inDeliveryOrders = [];

  isLoading = true;

  sub: Subscription;

  deliveryManId;

  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.orderId = +params["id"];
    });
    this.inDeliveryOrdersSubscription = this.orderService.inDeliveryOrdersSubject.subscribe(
      (orders: any) => {
        this.inDeliveryOrders = orders;
      }
    );
    this.orderService.emitInDeliveryOrdersSubject();
  }

  ionViewWillEnter() {
    this.orderService.getPendingOrderDetails(this.orderId).subscribe(
      (order: any) => {
        this.order = order;
        console.log(this.order);
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
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

  onComplete() {
    //Call API to change status of order
    //If inDeliveryOrders.length == 0 then stop tracking

    this.orderService.completeDelivery(this.orderId, 3).then(
      () => {
        if (this.inDeliveryOrders.length == 0) {
          //Uncomment this line when the app is nearly finished
          //this.stopBackgroundTracking();
        }
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

  stopBackgroundTracking() {
    window.app.backgroundGeolocation.stop();
  }

  async presentToast(msg: string, type: string) {
    const toast = await this.toastController.create({
      message: msg,
      color: type,
      duration: 2000,
      cssClass: "toast",
    });
    toast.present();
  }
}

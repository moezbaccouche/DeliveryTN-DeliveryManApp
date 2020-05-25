import { Component, OnInit } from "@angular/core";
import { OrderService } from "../services/order.service";
import { Subscription } from "rxjs";

declare var window;
@Component({
  selector: "app-tab1",
  templateUrl: "tab1.page.html",
  styleUrls: ["tab1.page.scss"],
})
export class Tab1Page implements OnInit {
  etoiles = new Array(5);

  show = false;

  inDeliveryOrdersSubscription: Subscription;
  inDeliveryOrders = [];

  deliveryManId = 1;
  isLoading = true;

  constructor(private orderService: OrderService) {}

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
}

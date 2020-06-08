import { Component, OnInit } from "@angular/core";
import { OrderService } from "../services/order.service";
import { ToastController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-tab2",
  templateUrl: "tab2.page.html",
  styleUrls: ["tab2.page.scss"],
})
export class Tab2Page implements OnInit {
  processingOrders = [];
  deliveryManId;
  isLoading = true;

  processingOrdersSubscription: Subscription;

  constructor(
    private orderService: OrderService,
    private toastController: ToastController,
    private domSanitizer: DomSanitizer
  ) {
    this.deliveryManId = localStorage.getItem("idDeliveryMan");
  }

  ngOnInit(): void {
    this.getDeliveryManProcessingOrders();
    this.processingOrdersSubscription = this.orderService.processingOrdersSubject.subscribe(
      (orders: any) => {
        this.processingOrders = orders;
        console.log(this.processingOrders);
      }
    );

    this.orderService.emitProcessingOrdersSubject();
  }

  getDeliveryManProcessingOrders() {
    this.orderService.getDeliveryManProcessingOrders(this.deliveryManId).then(
      () => {
        this.isLoading = false;
      },
      (error) => {
        console.log();
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

  async presentToast(msg: string, type: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: type,
      cssClass: "toast",
    });
    toast.present();
  }
}

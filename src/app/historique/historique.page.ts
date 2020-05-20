import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { OrderService } from "../services/order.service";
import { ToastController, PopoverController } from "@ionic/angular";
import { PopoverClientProfileComponent } from "../components/popover-client-profile/popover-client-profile.component";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-historique",
  templateUrl: "./historique.page.html",
  styleUrls: ["./historique.page.scss"],
})
export class HistoriquePage implements OnInit {
  myDeliveredOrders = [];
  deliveryManId = 1;
  myDeliveredOrdersSub: Subscription;

  isLoading = true;

  constructor(
    private orderService: OrderService,
    private toastController: ToastController,
    private popoverController: PopoverController,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.myDeliveredOrdersSub = this.orderService
      .getMyDeliveredOrders(this.deliveryManId)
      .subscribe(
        (response: any) => {
          this.isLoading = false;
          console.log(response);
          this.myDeliveredOrders = response;
        },
        (error) => {
          console.log(error);
          this.isLoading = true;
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

  async presentPopoverClientProfile(idClient: any) {
    const popover = await this.popoverController.create({
      component: PopoverClientProfileComponent,
      event: idClient,
      translucent: true,
      componentProps: {
        id: idClient,
        onclick: () => {
          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }
}

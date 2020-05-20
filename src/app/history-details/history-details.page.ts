import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import { ToastController, PopoverController } from "@ionic/angular";
import { OrderService } from "../services/order.service";
import { DomSanitizer } from "@angular/platform-browser";
import { PopoverClientProfileComponent } from "../components/popover-client-profile/popover-client-profile.component";

@Component({
  selector: "app-history-details",
  templateUrl: "./history-details.page.html",
  styleUrls: ["./history-details.page.scss"],
})
export class HistoryDetailsPage implements OnInit {
  sub: Subscription;
  orderId: number;
  order: any;
  isLoading = true;

  constructor(
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private orderService: OrderService,
    private domSanitizer: DomSanitizer,
    private popoverController: PopoverController
  ) {}

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params: any) => {
      this.orderId = +params["id"];
    });
  }

  ionViewDidEnter() {
    this.orderService.getOrderDetails(this.orderId).subscribe(
      (response: any) => {
        this.order = response;
        console.log(response);
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
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

  async presentToast(msg: string, type: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: "toast",
      color: type,
    });
    toast.present();
  }
}

import { Component, OnInit } from "@angular/core";
import { OrderService } from "src/app/services/order.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { ToastController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-order-summary",
  templateUrl: "./order-summary.page.html",
  styleUrls: ["./order-summary.page.scss"],
})
export class OrderSummaryPage implements OnInit {
  orderId;
  order;

  isLoading = true;

  sub: Subscription;

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
  }

  ionViewWillEnter() {
    this.orderService.getPendingOrderDetails(this.orderId).subscribe(
      (order: any) => {
        this.order = order;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
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

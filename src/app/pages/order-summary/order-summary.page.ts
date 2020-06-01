import { Component, OnInit } from "@angular/core";
import { OrderService } from "src/app/services/order.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ToastController, PopoverController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";
import { SignaturePage } from "src/app/signature/signature.page";
import { PushService } from "src/app/services/push.service";

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

  signatureImage = "";

  constructor(
    private orderService: OrderService,
    private activatedRoute: ActivatedRoute,
    private toastController: ToastController,
    private domSanitizer: DomSanitizer,
    private popoverController: PopoverController,
    private router: Router,
    private pushService: PushService
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

  completeDelivery() {
    //Call API to change status of order
    //If inDeliveryOrders.length == 0 then stop tracking

    this.orderService
      .completeDelivery(this.orderId, 3, this.signatureImage)
      .then(
        () => {
          if (this.inDeliveryOrders.length == 0) {
            //Uncomment this line when the app is nearly finished
            //this.stopBackgroundTracking();
          }
          this.router.navigate(["/tabs/tab2"]);
          this.presentToast("Livraison terminée !", "success");
          this.pushService
            .sendNotification(
              "Commande livrée",
              "Votre commande a été livrée.\nPensez à noter le livreur en accedant aux détails de la commande pour qu'on puisse améliorer la qualité de notre service.\n\nNous vous remercions de votre confiance et nous espérons vous revoir bientôt.",
              this.order.client.playerId
            )
            .subscribe(
              () => {},
              (error) => {
                this.presentToast(
                  "Notification de l'utilisateur impossible !",
                  "danger"
                );
              }
            );
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

  async presentPopoverSignature(ev: any) {
    const popover = await this.popoverController.create({
      component: SignaturePage,
      event: ev,
      translucent: true,
      componentProps: {
        onclick: (imageBase64) => {
          this.signatureImage = imageBase64;
          this.completeDelivery();
          popover.dismiss();
        },
      },
    });
    return await popover.present();
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

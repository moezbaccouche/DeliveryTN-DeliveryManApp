import { Component } from "@angular/core";
import { DeliveryMan } from "../models/deliveryman.model";
import { FormGroup } from "@angular/forms";
import { DeliveryManService } from "../services/delivery-man.service";
import { ToastController, PopoverController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
import { OrderService } from "../services/order.service";
import { PopoverProfileMenuComponent } from "../components/popover-profile-menu/popover-profile-menu.component";
import { Router } from "@angular/router";

@Component({
  selector: "app-tab3",
  templateUrl: "tab3.page.html",
  styleUrls: ["tab3.page.scss"],
})
export class Tab3Page {
  iconType: string = "eye-off-outline";

  readOnly: boolean;

  deliveryMan: any;
  delivManId;
  deliveryManSubscription: Subscription;
  myDeliveredOrdersSubscription: Subscription;

  isLoading = true;

  nbDeliveredOrders = 0;

  constructor(
    private deliverymanService: DeliveryManService,
    private toastController: ToastController,
    private domSanitizer: DomSanitizer,
    private orderService: OrderService,
    private popoverController: PopoverController,
    private router: Router
  ) {
    this.delivManId = +localStorage.getItem("idDeliveryMan");
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.getDeliveryMan();
    this.deliveryManSubscription = this.deliverymanService.delivmanSubject.subscribe(
      (data) => {
        this.deliveryMan = data;
      }
    );
    this.deliverymanService.emitDeliveryManSubject();

    this.getDeliveredOrders();
    this.myDeliveredOrdersSubscription = this.orderService.myDeliveredOrdersSubject.subscribe(
      (orders: any) => {
        this.nbDeliveredOrders = orders.length;
      }
    );
  }

  getDeliveryMan() {
    this.deliverymanService.getDelivMan(this.delivManId).then(
      () => {
        this.isLoading = false;
      },
      (error) => {
        this.presentToast("Une erreur s'est produite !", "danger");
        console.log(error);
      }
    );
  }

  getDeliveredOrders() {
    this.orderService.getMyDeliveredOrders(this.delivManId).then(
      () => {},
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

  async presentPopoverMenu(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoverProfileMenuComponent,
      event: ev,
      translucent: true,
      componentProps: {
        onclick: (answer) => {
          if (answer == 1) {
            //Logout
            localStorage.removeItem("token");
            this.router.navigate(["/login"]);
            console.log("déconnexion");
          }
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
      cssClass: "toastCart",
      color: type,
    });
    toast.present();
  }
}

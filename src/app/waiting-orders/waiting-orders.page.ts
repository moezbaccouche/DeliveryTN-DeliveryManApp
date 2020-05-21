import { Component, OnInit, OnDestroy } from "@angular/core";
import { OrderService } from "../services/order.service";
import { Subscription } from "rxjs";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { ToastController } from "@ionic/angular";
import { LaunchNavigator } from "@ionic-native/launch-navigator/ngx";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-waiting-orders",
  templateUrl: "./waiting-orders.page.html",
  styleUrls: ["./waiting-orders.page.scss"],
})
export class WaitingOrdersPage implements OnInit, OnDestroy {
  pendingOrders: any[] = [];
  isLoading = true;

  constructor(
    private orderService: OrderService,
    private toastController: ToastController,
    private launchNavigator: LaunchNavigator,
    private domSanitizer: DomSanitizer
  ) {}

  pendingOrdersSubscription: Subscription;

  ngOnInit() {
    this.pendingOrdersSubscription = this.orderService.pendingOrdersSubject.subscribe(
      (orders: any[]) => {
        this.pendingOrders = orders;
        console.log(this.pendingOrders);
      },
      (error) => {},
      () => {
        console.log("finished");
      }
    );
    this.orderService.emitPendingOrdersSubject();
  }

  ionViewWillEnter() {
    this.getPendingOrders();
  }

  getPendingOrders() {
    this.orderService.getPendingOrders().then(
      () => {
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onOpenMap(lat, long) {
    console.log(lat + " " + long);
    this.launchNavigator.navigate([long, lat]).then(
      (success) => {
        console.log("Carte lancée !");
      },
      (error) => {
        console.log(error);
        this.presentToast("Impossible d'ouvrir la carte !", "danger");
      }
    );
  }

  async presentToast(msg: string, type: string) {
    let toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: type,
      cssClass: "toast",
    });
    toast.present();
  }

  ngOnDestroy(): void {
    this.pendingOrdersSubscription.unsubscribe();
  }
}

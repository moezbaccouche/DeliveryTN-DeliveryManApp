import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "src/app/services/order.service";
import { ToastController, PopoverController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { mapToken } from "../../../assets/mapToken";
import * as mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { DeliveryInfoService } from "../../services/delivery-info.service";
import { PopoverMissingProductsComponent } from "src/app/components/popover-missing-products/popover-missing-products.component";
import { PopoverBoughtProductComponent } from "src/app/components/popover-bought-product/popover-bought-product.component";
import { PopoverAbortBuyingProductComponent } from "src/app/components/popover-abort-buying-product/popover-abort-buying-product.component";
import { LaunchNavigator } from "@ionic-native/launch-navigator/ngx";

declare var window;

@Component({
  selector: "app-processing-order-details",
  templateUrl: "./processing-order-details.page.html",
  styleUrls: ["./processing-order-details.page.scss"],
})
export class ProcessingOrderDetailsPage implements OnInit {
  displayProducts = true;

  sub: Subscription;
  orderId;
  order;

  isLoading = true;
  isUpdating = false;
  updatingProducts = false;

  distance = 0;
  marker: any;

  deliveryManLat = 0;
  deliveryManLng = 0;
  private map: mapboxgl.Map;
  style = "mapbox://styles/mapbox/outdoors-v11";
  markerClient;

  nbBoughtProducts = 0;
  boughtProducts = [];
  missingProducts = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private toastController: ToastController,
    private domSanitizer: DomSanitizer,
    private callNumber: CallNumber,
    private geolocation: Geolocation,
    private deliveryInfoService: DeliveryInfoService,
    private popoverController: PopoverController,
    private router: Router,
    private launchNavigator: LaunchNavigator
  ) {
    mapboxgl.accessToken = mapToken;
  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.orderId = +params["id"];
    });
  }

  ionViewWillEnter() {
    console.log("Hello");
    this.orderService.getProcessingOrderDetails(this.orderId).subscribe(
      (response: any) => {
        this.order = response;
        this.isLoading = false;
        console.log(this.order);
        this.getCurrentLocation();
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

  ionViewDidEnter() {}

  changeProductsVisibility() {
    if (this.displayProducts) {
      this.displayProducts = false;
    } else {
      this.displayProducts = true;
    }
  }

  callClient(phoneNumber) {
    this.callNumber
      .callNumber(phoneNumber, true)
      .then((res) => console.log("Launched dialer!", res))
      .catch((err) => {
        console.log("Error launching dialer", err);
        this.presentToast("Impossible de passer l'appel", "danger");
      });
  }

  buildMap() {
    console.log(this.deliveryManLng + " " + this.deliveryManLat);

    let conf = {
      container: "mapContainer",
      style: this.style,
      zoom: 11,
      center: [this.deliveryManLng, this.deliveryManLat],
      //center : [long, lat]
    };
    this.map = new mapboxgl.Map(conf);
    this.markerClient = new mapboxgl.Marker()
      .setLngLat([
        this.order.client.location.long,
        this.order.client.location.lat,
      ])
      .addTo(this.map);
  }

  getCurrentLocation() {
    this.geolocation.getCurrentPosition().then(
      (response) => {
        this.deliveryManLat = response.coords.latitude;
        this.deliveryManLng = response.coords.longitude;
        setTimeout(() => {
          this.buildMap();
          this.addDeliveryManMarker();
          this.getMatch();
        }, 0);
      },
      (error) => {
        this.presentToast("Impossible de localiser votre position !", "danger");
      }
    );
  }

  getMatch() {
    const coordsClients = [
      this.order.client.location.long,
      this.order.client.location.lat,
    ];

    const coordsDeliveryMan = [this.deliveryManLng, this.deliveryManLat];
    const coords = [coordsDeliveryMan, coordsClients];
    var newCoords = coords.join(";");

    this.deliveryInfoService.getRoute(newCoords, mapToken).then(
      (response: any) => {
        this.addRoute(response.routes[0].geometry);
        this.distance = response.routes[0].distance * 0.001;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addRoute(coords) {
    // check if the route is already loaded
    if (this.map.getSource("route")) {
      this.map.removeLayer("route");
      this.map.removeSource("route");
    }
    this.map.addLayer({
      id: "route",
      type: "line",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: coords,
        },
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#1db7dd",
        "line-width": 8,
        "line-opacity": 0.8,
      },
    });
  }

  addDeliveryManMarker() {
    var el = document.createElement("div");
    el.className = "marker";
    el.style.backgroundImage = "url(../../assets/deliveryTruck48.png)";
    el.style.width = "48px";
    el.style.height = "48px";

    this.marker = new mapboxgl.Marker(el)
      .setLngLat([this.deliveryManLng, this.deliveryManLat])
      .addTo(this.map);
  }

  onOpenMap() {
    this.launchNavigator
      .navigate([
        this.order.client.location.lat,
        this.order.client.location.long,
      ])
      .then(
        (success) => {
          console.log("Carte lancée !");
        },
        (error) => {
          console.log(error);
          this.presentToast("Impossible d'ouvrir la carte !", "danger");
        }
      );
  }

  onDeliverOrderClick() {
    //Change the status of order
    if (this.nbBoughtProducts != this.order.products.length) {
      /*  Display popover asking if he's willing to deliver
          the order even though some products are not bought yet.
      */
      this.presentPopoverMissingProducts();
    } else {
      this.deliverOrder();
    }
  }

  deliverOrder() {
    this.initMissingProductsArray();
    this.isUpdating = true;
    this.orderService
      .deliverOrder(this.orderId, 2, this.missingProducts)
      .subscribe(
        (response: any) => {
          console.log(response);
          this.order = response;
          this.order.status = 2;
          this.order.statusString = "En cours de livraison";
          this.isUpdating = false;

          //Uncomment this line when the app is nearly finished
          //this.startBackgroundTracking();
        },
        (error) => {
          console.log(error);
          this.isUpdating = false;
          this.presentToast("Une erreur est survenue !", "danger");
        }
      );
  }

  startBackgroundTracking() {
    window.app.backgroundGeolocation.start();
  }

  completeDelivery() {
    //Navigate to summary page

    this.router.navigate(["/order-summary", this.orderId]);
  }

  editBoughtProducts(e, product) {
    //Increase or decrease the number of bought products
    if (e.detail.checked) {
      this.nbBoughtProducts++;
      this.boughtProducts.push(product);
    } else {
      this.nbBoughtProducts--;
      const index = this.boughtProducts.findIndex((p) => {
        return p.id === product.id;
      });
      if (index !== -1) {
        this.boughtProducts.splice(index, 1);
      }
    }
  }

  initMissingProductsArray() {
    this.missingProducts = [];
    this.order.products.forEach((p) => {
      if (!this.boughtProducts.includes(p)) {
        this.missingProducts.push(p.id);
      }
    });
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

  async presentPopoverMissingProducts() {
    const popover = await this.popoverController.create({
      component: PopoverMissingProductsComponent,
      translucent: true,
      componentProps: {
        onclick: (answer) => {
          console.log(answer);
          if (answer) {
            this.deliverOrder();
          }
          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }

  async presentBoughtProductPopover(productId, amount) {
    const popover = await this.popoverController.create({
      component: PopoverBoughtProductComponent,
      translucent: true,
      componentProps: {
        requiredAmount: amount,
        onclick: (answer, amount) => {
          console.log(amount);
          //Change notBought to false
          //update the amount
          if (answer) {
            this.updatingProducts = true;
            this.orderService
              .buyProduct(this.orderId, productId, parseInt(amount))
              .subscribe(
                (response: any) => {
                  this.order = response;
                  this.updatingProducts = false;
                  this.presentToast("Commande mise à jour !", "success");
                },
                (error) => {
                  console.log(error);
                  this.updatingProducts = false;
                  this.presentToast("Une erreur est survenue !", "danger");
                }
              );
          }

          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }

  async presentPopoverAbortBuyingProduct(productId) {
    const popover = await this.popoverController.create({
      component: PopoverAbortBuyingProductComponent,
      translucent: true,
      componentProps: {
        onclick: (answer) => {
          console.log(answer);
          if (answer) {
            this.updatingProducts = true;
            this.orderService
              .abortBuyingProduct(this.orderId, productId)
              .subscribe(
                (response: any) => {
                  this.order = response;
                  this.updatingProducts = false;
                  this.presentToast("Commande mise à jour !", "success");
                },
                (error) => {
                  console.log(error);
                  this.updatingProducts = false;
                  this.presentToast("Une erreur est survenue !", "danger");
                }
              );
          }
          popover.dismiss();
        },
      },
    });

    return await popover.present();
  }
}

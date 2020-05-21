import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
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

  distance = 0;
  marker: any;

  deliveryManLat;
  deliveryManLng;
  private map: mapboxgl.Map;
  style = "mapbox://styles/mapbox/outdoors-v11";

  nbBoughtProducts = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private toastController: ToastController,
    private domSanitizer: DomSanitizer,
    private callNumber: CallNumber,
    private geolocation: Geolocation,
    private deliveryInfoService: DeliveryInfoService,
    private popoverController: PopoverController
  ) {
    mapboxgl.accessToken = mapToken;
  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.orderId = +params["id"];
    });
    this.getCurrentLocation();
  }

  ionViewWillEnter() {
    this.orderService.getProcessingOrderDetails(this.orderId).subscribe(
      (response: any) => {
        this.order = response;
        this.isLoading = false;
        console.log(this.order);
        setTimeout(() => {
          this.buildMap();
          this.addDeliveryManMarker();
          this.getMatch();
        }, 0);
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

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
    let conf = {
      container: "map",
      style: this.style,
      zoom: 11,
      center: [this.deliveryManLng, this.deliveryManLat],
      //center : [long, lat]
    };
    this.map = new mapboxgl.Map(conf);

    var marker = new mapboxgl.Marker()
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
    this.isUpdating = true;
    this.orderService.deliverOrder(this.orderId, 2).subscribe(
      () => {
        this.order.status = 2;
        this.order.statusString = "En cours de livraison";
        this.isUpdating = false;
      },
      (error) => {
        console.log(error);
        this.isUpdating = false;
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

  completeDelivery() {
    //Navigate to summary page
  }

  editNbBoughtProducts(e) {
    //Increase or decrease the number of bought products
    if (e.detail.checked) {
      this.nbBoughtProducts++;
    } else {
      this.nbBoughtProducts--;
    }
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
}

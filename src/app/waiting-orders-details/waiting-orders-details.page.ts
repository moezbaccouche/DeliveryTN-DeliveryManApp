import { Component, OnInit } from "@angular/core";
import { OrderService } from "../services/order.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";
import { mapToken } from "../../assets/mapToken";
import * as mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { DeliveryInfoService } from "../services/delivery-info.service";

declare var window;

@Component({
  selector: "app-waiting-orders-details",
  templateUrl: "./waiting-orders-details.page.html",
  styleUrls: ["./waiting-orders-details.page.scss"],
})
export class WaitingOrdersDetailsPage implements OnInit {
  orderId = 0;
  sub: Subscription;
  order = null;
  isLoading = true;

  deliveryManLat;
  deliveryManLng;
  distance = 0;

  //Fixed for 15 minutes in case something goes wrong with the map api
  duration = 15;
  marker: any;

  buttonDisabled = false;
  isAccepted = false;
  deliveryManId = 1;

  private map: mapboxgl.Map;
  style = "mapbox://styles/mapbox/outdoors-v11";
  markerClient;

  constructor(
    private orderService: OrderService,
    private toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private domSanitizer: DomSanitizer,
    private geolocation: Geolocation,
    private deliveryInfoService: DeliveryInfoService,
    private router: Router
  ) {
    mapboxgl.accessToken = mapToken;
  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.orderId = +params["id"];
    });
  }

  ionViewWillEnter() {
    this.orderService.getPendingOrderDetails(this.orderId).subscribe(
      (response: any) => {
        this.order = response;
        this.isLoading = false;
        this.getCurrentLocation();
      },
      (error) => {
        console.log(error);
        this.presentToast("Une erreur est survenue !", "danger");
      }
    );
  }

  ionViewDidEnter() {}

  buildMap() {
    let conf = {
      container: "map",
      style: this.style,
      zoom: 14,
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
        this.duration = response.routes[0].duration / 60;
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

  onAcceptOrderDelivery() {
    this.buttonDisabled = true;
    this.orderService
      .acceptOrderDelivery(
        this.orderId,
        this.deliveryManId,
        parseFloat(this.duration.toFixed(2))
      )
      .then(
        () => {
          this.isAccepted = true;
          this.router.navigate(["/processing-order-details", this.orderId]);
          this.presentToast(
            "Vous avez accepté de livrer la commande !",
            "success"
          );
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

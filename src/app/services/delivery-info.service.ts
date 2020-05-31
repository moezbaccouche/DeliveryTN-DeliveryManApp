import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DeliveryInfoService {
  constructor(private http: HttpClient) {}
  private baseUrl: string =
    "http://192.168.1.5:51044/delivery-app/deliveryInfos";

  getRoute(coordinates, accessToken) {
    var url =
      "https://api.mapbox.com/directions/v5/mapbox/driving/" +
      coordinates +
      "?geometries=geojson&steps=true&access_token=" +
      accessToken;

    return new Promise((resolve, reject) => {
      fetch(url).then((response) => {
        resolve(response.json());
      }),
        (error) => {
          reject(error);
        };
    });
  }

  updateCurrenLocation(lat, long, deliveryManId) {
    let httpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    let options = {
      headers: httpHeaders,
    };

    return this.http.post(
      `${this.baseUrl}/location/update`,
      {
        long: long,
        lat: lat,
        deliveryManId: deliveryManId,
      },
      options
    );
  }
}

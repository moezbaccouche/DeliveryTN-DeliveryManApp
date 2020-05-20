import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DeliveryInfoService {
  constructor() {}

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
}

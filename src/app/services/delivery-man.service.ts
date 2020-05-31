import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DeliveryMan } from "../models/deliveryman.model";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DeliveryManService {
  private baseUrl: string = "http://192.168.1.5:51044/delivery-app/deliveryMen";
  private deliveryMan: any;
  delivmanSubject = new Subject<any>();

  constructor(private http: HttpClient) {}

  emitDeliveryManSubject() {
    this.delivmanSubject.next(this.deliveryMan);
  }

  getDelivMan(deliveryManId) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}/details/${deliveryManId}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.deliveryMan = data;
          this.emitDeliveryManSubject();
          resolve("Livreur récupéré avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });
  }

  register(newDeliveryMan) {
    return this.http.post(`${this.baseUrl}/register`, newDeliveryMan);
  }

  login(deliveryManCredentials) {
    return this.http.post(
      `${this.baseUrl}/loginDeliveryMan`,
      deliveryManCredentials
    );
  }

  resetPassword(email) {
    return this.http.post(`${this.baseUrl}/resetPassword`, email);
  }

  resendVerificationEmail(email) {
    return this.http.post(`${this.baseUrl}/resendEmail`, email);
  }
}

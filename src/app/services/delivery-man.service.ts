import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DeliveryMan } from '../models/deliveryman.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeliveryManService {

  private baseUrl: string = "http://192.168.1.7:51044/delivery-app/deliverymen";
  private deliveryman: DeliveryMan;
  delivmanSubject = new Subject<DeliveryMan>();

  constructor(private http: HttpClient) {}

  emitClientSubject() {
    this.delivmanSubject.next(this.deliveryman);
  }

  getDelivMan(DelevManId) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}deliverymen/${DelevManId}`)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          this.deliveryman = new DeliveryMan(
            data.id,
            data.firstName,
            data.lastName,
            data.dateOfBirth,
            data.phone,
            data.email,
            data.imageBase64,
          );
          this.emitClientSubject();
          resolve("Client récupéré avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });
  }
}

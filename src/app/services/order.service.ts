import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private baseUrl: string = "http://192.168.1.6:51044/delivery-app/orders";

  private pendingOrders: any[] = [];

  pendingOrdersSubject = new Subject<any[]>();

  constructor(private http: HttpClient) {}

  emitPendingOrdersSubject() {
    this.pendingOrdersSubject.next(this.pendingOrders.slice());
  }

  getMyDeliveredOrders(deliveryManId) {
    return this.http.get(`${this.baseUrl}/deliveryMan/${deliveryManId}`);
  }

  getOrderDetails(orderId) {
    return this.http.get(`${this.baseUrl}/history/${orderId}`);
  }

  getPendingOrders() {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}/pending`)
        .then((response: any) => {
          return response.json();
        })
        .then((data) => {
          this.pendingOrders = data;
          this.emitPendingOrdersSubject();
          resolve("Commandes récuperées avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });
  }
}

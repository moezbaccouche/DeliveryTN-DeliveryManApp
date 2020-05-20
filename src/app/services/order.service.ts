import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private baseUrl: string = "http://192.168.1.6:51044/delivery-app/orders";

  constructor(private http: HttpClient) {}

  getMyDeliveredOrders(deliveryManId) {
    return this.http.get(`${this.baseUrl}/deliveryMan/${deliveryManId}`);
  }

  getOrderDetails(orderId) {
    return this.http.get(`${this.baseUrl}/history/${orderId}`);
  }
}

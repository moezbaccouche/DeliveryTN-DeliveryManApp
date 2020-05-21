import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private baseUrl: string = "http://192.168.1.6:51044/delivery-app/orders";

  private pendingOrders: any[] = [];
  private processingOrders: any[] = [];
  private myDeliveredOrders: any[] = [];

  pendingOrdersSubject = new Subject<any[]>();
  processingOrdersSubject = new Subject<any[]>();
  myDeliveredOrdersSubject = new Subject<any[]>();

  constructor(private http: HttpClient) {}

  emitPendingOrdersSubject() {
    this.pendingOrdersSubject.next(this.pendingOrders.slice());
  }

  emitProcessingOrdersSubject() {
    this.processingOrdersSubject.next(this.processingOrders.slice());
  }

  emitMyDeliveredOrdersSubject() {
    this.myDeliveredOrdersSubject.next(this.myDeliveredOrders.slice());
  }

  getMyDeliveredOrders(deliveryManId) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}/deliveryMan/${deliveryManId}`)
        .then((response: any) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          this.myDeliveredOrders = data;
          this.emitMyDeliveredOrdersSubject();
          resolve("Commandes récuperées avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });

    // return this.http.get(`${this.baseUrl}/deliveryMan/${deliveryManId}`);
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

  getPendingOrderDetails(orderId) {
    return this.http.get(`${this.baseUrl}/details/${orderId}`);
  }

  getDeliveryManProcessingOrders(deliveryManId) {
    return new Promise((resolve, reject) => {
      fetch(`${this.baseUrl}/processing/deliveryMan/${deliveryManId}`)
        .then((response: any) => {
          return response.json();
        })
        .then((data) => {
          this.processingOrders = data;
          this.emitProcessingOrdersSubject();
          resolve("Commandes récuperées avec succès !");
        }),
        (error) => {
          reject(error);
        };
    });
  }

  getProcessingOrderDetails(orderId) {
    return this.http.get(`${this.baseUrl}/processing/details/${orderId}`);
  }

  deliverOrder(orderId, newStatus) {
    let httpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    let options = {
      headers: httpHeaders,
    };

    return this.http.post(
      `${this.baseUrl}/deliverOrder`,
      {
        idOrder: orderId,
        newStatus: newStatus,
      },
      options
    );
  }

  completeDelivery(orderId, newStatus) {
    return fetch(`${this.baseUrl}/update`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        IdOrder: orderId,
        newStatus: newStatus,
      }),
    })
      .then((response) => {
        this.myDeliveredOrders.push(response);
        this.emitMyDeliveredOrdersSubject();
      })
      .catch((error) => console.error(error));
  }

  acceptOrderDelivery(idOrder, idDeliveryMan, duration) {
    // let httpHeaders = new HttpHeaders({
    //   Accept: "application/json",
    //   "Content-Type": "application/json",
    // });
    // let options = {
    //   headers: httpHeaders,
    // };

    // return this.http.post(
    //   `${this.baseUrl}/acceptOrder`,
    //   {
    //     orderId: idOrder,
    //     deliveryManId: idDeliveryMan,
    //     durationToDestination: duration,
    //   },
    //   options
    // );
    console.log(idOrder, idDeliveryMan, duration);
    return fetch(`${this.baseUrl}/acceptOrder`, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: idOrder,
        deliveryManId: idDeliveryMan,
        durationToDestination: duration,
      }),
    })
      .then((response) => {
        const index = this.pendingOrders.findIndex((o) => {
          return o.orderId === idOrder;
        });

        console.log(this.pendingOrders);

        if (index !== -1) {
          this.pendingOrders.splice(index, 1);
        }
        console.log(this.pendingOrders);

        this.emitPendingOrdersSubject();
      })
      .catch((error) => console.error(error));
  }
}

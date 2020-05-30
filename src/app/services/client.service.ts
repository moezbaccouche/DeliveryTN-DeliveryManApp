import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class ClientService {
  private baseUrl: string = "http://192.168.1.9:51044/delivery-app/clients";
  constructor(private http: HttpClient) {}

  getClient(idClient) {
    return this.http.get(`${this.baseUrl}/${idClient}`);
  }
}

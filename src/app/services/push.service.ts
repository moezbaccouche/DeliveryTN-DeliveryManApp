import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class PushService {
  constructor(private http: HttpClient) {}

  addDevice() {
    let httpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    let options = {
      headers: httpHeaders,
    };

    return this.http.post(
      "https://onesignal.com/api/v1/players",
      {
        app_id: "4d92a6e0-c0bb-42b6-8bf1-01be7bc90286",
        device_type: 1,
      },
      options
    );
  }

  sendNotification(title: string, msg: string, playerId: string) {
    console.log(playerId);
    let httpHeaders = new HttpHeaders({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    let options = {
      headers: httpHeaders,
    };

    return this.http.post(
      "https://onesignal.com/api/v1/notifications",
      {
        app_id: "4d92a6e0-c0bb-42b6-8bf1-01be7bc90286",
        include_player_ids: [playerId],
        headings: {
          fr: title,
          en: title,
        },
        contents: {
          fr: msg,
          en: msg,
        },
        android_accent_color: "FF6E1C1C",
      },
      options
    );
  }
}

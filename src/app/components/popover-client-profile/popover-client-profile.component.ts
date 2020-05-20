import { Component, OnInit, Input } from "@angular/core";
import { ClientService } from "src/app/services/client.service";
import { ToastController } from "@ionic/angular";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "app-popover-client-profile",
  templateUrl: "./popover-client-profile.component.html",
  styleUrls: ["./popover-client-profile.component.scss"],
})
export class PopoverClientProfileComponent implements OnInit {
  @Input()
  public id: number;

  client: any = {
    firstName: "",
    lastName: "",
    imageBase64: "",
    phone: "",
    email: "",
  };

  isLoading = true;

  constructor(
    private clientService: ClientService,
    private toastController: ToastController,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.getClient();
  }

  getClient() {
    this.clientService.getClient(this.id).subscribe(
      (response: any) => {
        this.client = response;
        this.isLoading = false;
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
      duration: 2000,
      cssClass: "toast",
      color: type,
    });
    toast.present();
  }
}

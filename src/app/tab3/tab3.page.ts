import { Component } from '@angular/core';
import { DeliveryMan } from '../models/deliveryman.model';
import { FormGroup } from '@angular/forms';
import { DeliveryManService } from '../services/delivery-man.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  passwordType: string = "password";
  iconType: string = "eye-off-outline";
  passwordShown: boolean = false;
  ButtonDisabled: boolean;
  readOnly: boolean;

  nomImage: string = "me";
  deliveryman: DeliveryMan;
  delivManId=1;
  
  isLoading = true;

  currentImage = "../../assets/me.png";

  imagePickerOptions = {
    maximumImagesCount: 1,
    quality: 50,
  };

  formProfile: FormGroup;
  showForm = false;
  confirmUpdateEmail = false;

  constructor(
    private deliverymanService:DeliveryManService,
    private toastController: ToastController
    ) {}

    ngOnInit() {
      this.getDeliveryMan();
      this.deliverymanService.emitClientSubject();

    }
    
    getDeliveryMan() {
    this.deliverymanService.getDelivMan(this.delivManId).then(
      () => {
        this.isLoading = false;
      },
      (error) => {
        this.presentToast("Une erreur s'est produite !", "danger");
        console.log(error);
      }
    );
  }

  async presentToast(msg: string, type: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      cssClass: "toastCart",
      color: type,
    });
    toast.present();
  }
}

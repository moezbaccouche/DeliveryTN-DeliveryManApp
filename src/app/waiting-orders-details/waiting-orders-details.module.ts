import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingOrdersDetailsPageRoutingModule } from './waiting-orders-details-routing.module';

import { WaitingOrdersDetailsPage } from './waiting-orders-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingOrdersDetailsPageRoutingModule
  ],
  declarations: [WaitingOrdersDetailsPage]
})
export class WaitingOrdersDetailsPageModule {}

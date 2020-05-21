import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProcessingOrderDetailsPageRoutingModule } from './processing-order-details-routing.module';

import { ProcessingOrderDetailsPage } from './processing-order-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProcessingOrderDetailsPageRoutingModule
  ],
  declarations: [ProcessingOrderDetailsPage]
})
export class ProcessingOrderDetailsPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingOrdersPageRoutingModule } from './waiting-orders-routing.module';

import { WaitingOrdersPage } from './waiting-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingOrdersPageRoutingModule
  ],
  declarations: [WaitingOrdersPage]
})
export class WaitingOrdersPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryDetailsPageRoutingModule } from './history-details-routing.module';

import { HistoryDetailsPage } from './history-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HistoryDetailsPageRoutingModule
  ],
  declarations: [HistoryDetailsPage]
})
export class HistoryDetailsPageModule {}

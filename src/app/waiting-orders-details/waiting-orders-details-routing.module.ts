import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingOrdersDetailsPage } from './waiting-orders-details.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingOrdersDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingOrdersDetailsPageRoutingModule {}

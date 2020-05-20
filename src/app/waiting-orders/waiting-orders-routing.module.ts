import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WaitingOrdersPage } from './waiting-orders.page';

const routes: Routes = [
  {
    path: '',
    component: WaitingOrdersPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitingOrdersPageRoutingModule {}

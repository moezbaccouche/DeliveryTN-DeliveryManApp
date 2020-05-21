import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProcessingOrderDetailsPage } from './processing-order-details.page';

const routes: Routes = [
  {
    path: '',
    component: ProcessingOrderDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessingOrderDetailsPageRoutingModule {}

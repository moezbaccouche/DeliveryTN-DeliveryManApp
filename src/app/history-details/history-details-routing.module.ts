import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryDetailsPage } from './history-details.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryDetailsPageRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SignaturePage } from './signature.page';

const routes: Routes = [
  {
    path: '',
    component: SignaturePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignaturePageRoutingModule {}

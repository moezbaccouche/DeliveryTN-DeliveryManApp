import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },  {
    path: 'historique',
    loadChildren: () => import('./historique/historique.module').then( m => m.HistoriquePageModule)
  },
  {
    path: 'history-details',
    loadChildren: () => import('./history-details/history-details.module').then( m => m.HistoryDetailsPageModule)
  },
  {
    path: 'waiting-orders',
    loadChildren: () => import('./waiting-orders/waiting-orders.module').then( m => m.WaitingOrdersPageModule)
  },
  {
    path: 'waiting-orders-details',
    loadChildren: () => import('./waiting-orders-details/waiting-orders-details.module').then( m => m.WaitingOrdersDetailsPageModule)
  }

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

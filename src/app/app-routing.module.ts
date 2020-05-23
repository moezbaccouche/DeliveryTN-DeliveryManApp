import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule),
  },
  {
    path: "historique",
    loadChildren: () =>
      import("./historique/historique.module").then(
        (m) => m.HistoriquePageModule
      ),
  },
  {
    path: "history-details/:id",
    loadChildren: () =>
      import("./history-details/history-details.module").then(
        (m) => m.HistoryDetailsPageModule
      ),
  },
  {
    path: "waiting-orders",
    loadChildren: () =>
      import("./waiting-orders/waiting-orders.module").then(
        (m) => m.WaitingOrdersPageModule
      ),
  },
  {
    path: "waiting-orders-details/:id",
    loadChildren: () =>
      import("./waiting-orders-details/waiting-orders-details.module").then(
        (m) => m.WaitingOrdersDetailsPageModule
      ),
  },
  {
    path: "processing-order-details/:id",
    loadChildren: () =>
      import(
        "./pages/processing-order-details/processing-order-details.module"
      ).then((m) => m.ProcessingOrderDetailsPageModule),
  },
  {
    path: "order-summary/:id",
    loadChildren: () =>
      import("./pages/order-summary/order-summary.module").then(
        (m) => m.OrderSummaryPageModule
      ),
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}

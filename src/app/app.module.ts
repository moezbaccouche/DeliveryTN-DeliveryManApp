import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { DeliveryManService } from "./services/delivery-man.service";
import { OrderService } from "./services/order.service";
import { registerLocaleData } from "@angular/common";
import localeFr from "@angular/common/locales/fr";
import { PopoverClientProfileComponent } from "./components/popover-client-profile/popover-client-profile.component";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { LaunchNavigator } from "@ionic-native/launch-navigator/ngx";
import { DeliveryInfoService } from "./services/delivery-info.service";
import { PopoverMissingProductsComponent } from "./components/popover-missing-products/popover-missing-products.component";
import { PopoverProfileMenuComponent } from "./components/popover-profile-menu/popover-profile-menu.component";

registerLocaleData(localeFr, "en");

@NgModule({
  declarations: [
    AppComponent,
    PopoverClientProfileComponent,
    PopoverMissingProductsComponent,
    PopoverProfileMenuComponent,
  ],
  entryComponents: [
    PopoverClientProfileComponent,
    PopoverMissingProductsComponent,
    PopoverProfileMenuComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CallNumber,
    DeliveryManService,
    OrderService,
    Geolocation,
    LaunchNavigator,
    DeliveryInfoService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

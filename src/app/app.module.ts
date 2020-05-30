import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";

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
import { Camera } from "@ionic-native/camera/ngx";
import { LaunchNavigator } from "@ionic-native/launch-navigator/ngx";
import { DeliveryInfoService } from "./services/delivery-info.service";
import { PopoverMissingProductsComponent } from "./components/popover-missing-products/popover-missing-products.component";
import { PopoverProfileMenuComponent } from "./components/popover-profile-menu/popover-profile-menu.component";
import { PopoverBoughtProductComponent } from "./components/popover-bought-product/popover-bought-product.component";
import { FormsModule } from "@angular/forms";
import { PopoverAbortBuyingProductComponent } from "./components/popover-abort-buying-product/popover-abort-buying-product.component";
import { AuthInterceptor } from "./auth/auth.interceptor";
import { BackgroundGeolocation } from "@ionic-native/background-geolocation/ngx";
import { IonicStorageModule } from "@ionic/storage";
import { SignaturePage } from "./signature/signature.page";

registerLocaleData(localeFr, "en");

@NgModule({
  declarations: [
    AppComponent,
    PopoverClientProfileComponent,
    PopoverMissingProductsComponent,
    PopoverProfileMenuComponent,
    PopoverBoughtProductComponent,
    PopoverAbortBuyingProductComponent,
    SignaturePage,
  ],
  entryComponents: [
    PopoverClientProfileComponent,
    PopoverMissingProductsComponent,
    PopoverProfileMenuComponent,
    PopoverBoughtProductComponent,
    PopoverAbortBuyingProductComponent,
    SignaturePage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
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
    Camera,
    BackgroundGeolocation,
    //The following line makes a token check for all the services requests
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    // { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

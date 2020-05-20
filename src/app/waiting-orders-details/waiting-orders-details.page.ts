import { Component, OnInit } from '@angular/core';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-waiting-orders-details',
  templateUrl: './waiting-orders-details.page.html',
  styleUrls: ['./waiting-orders-details.page.scss'],
})
export class WaitingOrdersDetailsPage implements OnInit {

  constructor(private callNumber: CallNumber) { }

  ngOnInit() {
  }

  lol(){
    this.callNumber.callNumber("55287186", true)
  .then(res => console.log('Launched dialer!', res))
  .catch(err => console.log('Error launching dialer', err));
  }
}

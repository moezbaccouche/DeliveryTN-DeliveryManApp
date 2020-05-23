import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-popover-abort-buying-product",
  templateUrl: "./popover-abort-buying-product.component.html",
  styleUrls: ["./popover-abort-buying-product.component.scss"],
})
export class PopoverAbortBuyingProductComponent implements OnInit {
  @Input()
  public onclick = (answer) => {};

  constructor() {}

  ngOnInit() {}

  onYes() {
    this.onclick(true);
  }

  onNo() {
    this.onclick(false);
  }
}

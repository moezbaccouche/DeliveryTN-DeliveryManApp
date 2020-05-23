import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-popover-bought-product",
  templateUrl: "./popover-bought-product.component.html",
  styleUrls: ["./popover-bought-product.component.scss"],
})
export class PopoverBoughtProductComponent implements OnInit {
  private productAmount = 1;
  private isZero = false;
  @Input()
  public onclick = (answer, productAmount) => {};

  @Input()
  public requiredAmount: number;

  constructor() {}

  ngOnInit() {}

  onConfirm() {
    this.onclick(true, this.productAmount);
  }

  incrementAmount() {
    this.isZero = false;
    if (this.productAmount < this.requiredAmount) {
      this.productAmount++;
    }
  }

  decrementAmount() {
    if (this.productAmount > 1) {
      this.productAmount--;
    }
  }

  onAbort() {
    this.onclick(false, this.productAmount);
  }
}

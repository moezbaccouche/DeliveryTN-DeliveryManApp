import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-popover-missing-products",
  templateUrl: "./popover-missing-products.component.html",
  styleUrls: ["./popover-missing-products.component.scss"],
})
export class PopoverMissingProductsComponent implements OnInit {
  @Input()
  public onclick = (answer) => {};

  answer = true;

  constructor() {}

  ngOnInit() {}

  onYes() {
    this.answer = true;
    this.onclick(this.answer);
  }

  onNo() {
    this.answer = false;
    this.onclick(this.answer);
  }
}

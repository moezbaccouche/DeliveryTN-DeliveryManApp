import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-popover-profile-menu",
  templateUrl: "./popover-profile-menu.component.html",
  styleUrls: ["./popover-profile-menu.component.scss"],
})
export class PopoverProfileMenuComponent implements OnInit {
  answer: number = 0;

  @Input()
  public onclick = (answer) => {};

  constructor() {}

  ngOnInit() {}

  LogOut() {
    this.answer = 1;
    this.onclick(this.answer);
  }
}

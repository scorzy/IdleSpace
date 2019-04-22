import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { MainService } from "src/app/main.service";

@Component({
  selector: "app-auto-ship",
  templateUrl: "./auto-ship.component.html",
  styleUrls: ["./auto-ship.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutoShipComponent implements OnInit {
  constructor(public ms: MainService) {}

  ngOnInit() {}
}

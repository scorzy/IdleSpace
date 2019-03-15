import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Enemy } from "src/app/model/enemy/enemy";

@Component({
  selector: "app-battlefield",
  templateUrl: "./battlefield.component.html",
  styleUrls: ["./battlefield.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattlefieldComponent implements OnInit {
  @Input() enemy: Enemy;

  constructor() {}

  ngOnInit() {}
}

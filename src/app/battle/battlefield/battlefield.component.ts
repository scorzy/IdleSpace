import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Enemy } from "src/app/model/enemy/enemy";
import { Zone } from "src/app/model/enemy/zone";

@Component({
  selector: "app-battlefield",
  templateUrl: "./battlefield.component.html",
  styleUrls: ["./battlefield.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattlefieldComponent implements OnInit {
  @Input() enemy: Enemy;
  numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  constructor() {}

  ngOnInit() {}

  getColor(zone: Zone) {
    return zone.number <= this.enemy.currentZone.number ? zone.color : "";
  }
}

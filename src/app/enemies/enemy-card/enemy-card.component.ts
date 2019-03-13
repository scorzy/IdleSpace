import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  Input
} from "@angular/core";
import { Enemy } from "src/app/model/enemy/enemy";

@Component({
  selector: "app-enemy-card",
  templateUrl: "./enemy-card.component.html",
  styleUrls: ["./enemy-card.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnemyCardComponent implements OnInit {
  @HostBinding("class")
  card = "card";

  @Input() enemy: Enemy;

  constructor() {}

  ngOnInit() {}
}

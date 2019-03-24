import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Production } from "../model/production";
import { Bonus } from "../model/bonus/bonus";

@Component({
  selector: "app-bonus-view",
  templateUrl: "./bonus-view.component.html",
  styleUrls: ["./bonus-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BonusViewComponent implements OnInit {
  @Input() production: Production;
  constructor() {}

  ngOnInit() {}

  bonusAddId(index: number, bonus: Bonus): string {
    return "add" + index + bonus.base.id;
  }
  bonusMulId(index: number, bonus: Bonus): string {
    return "mul" + index + bonus.base.id;
  }
}

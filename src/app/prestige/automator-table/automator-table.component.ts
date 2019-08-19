import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";
import { MainService } from "src/app/main.service";
import {
  TIME_LEVELS,
  AutomatorManager
} from "src/app/model/automators/automatorManager";

@Component({
  selector: "app-automator-table",
  templateUrl: "./automator-table.component.html",
  styleUrls: ["./automator-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomatorTableComponent implements OnInit {
  @HostBinding("class")
  contentContainer = "content-container";

  prestige = new Array<[number, string[][], number[]]>();
  AutomatorManager = AutomatorManager;

  constructor(public ms: MainService) {}

  ngOnInit() {
    for (let i = 0; i < 100; i++) {
      const auto = this.ms.game.automatorManager.automatorGroups
        .filter(a => a.prestigeLevel === i)
        .map(a => [a.name, a.description]);
      const timer = TIME_LEVELS.filter(t => t[1] === i).map(a => a[0]);
      if (auto.length > 0 || timer.length > 0) {
        this.prestige.push([i, auto, timer]);
      }
    }
  }
  prestigeId(index: number, row: [number, string[][], number[]]) {
    return row[0];
  }
}

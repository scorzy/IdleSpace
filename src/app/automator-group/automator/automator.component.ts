import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Automator } from "../../model/automators/automator";
import { MainService } from "../../main.service";

@Component({
  selector: "app-automator",
  templateUrl: "./automator.component.html",
  styleUrls: ["./automator.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomatorComponent implements OnInit {
  @Input() auto: Automator;
  intervals = new Array<number>();

  constructor(public ms: MainService) {}

  ngOnInit() {
    this.intervals = this.ms.game.automatorManager.times;
  }

  timeId(index: number, time: number) {
    return index + " " + time;
  }
}

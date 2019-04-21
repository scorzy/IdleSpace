import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  ChangeDetectorRef,
  HostBinding
} from "@angular/core";
import { Automator } from "../../model/automators/automator";
import { MainService } from "../../main.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-automator",
  templateUrl: "./automator.component.html",
  styleUrls: ["./automator.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AutomatorComponent implements OnInit, OnDestroy {
  @HostBinding("class")
  card = "card";
  @Input() auto: Automator;
  intervals = new Array<number>();
  progress = 50;
  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.setProgress();
    this.intervals = this.ms.game.automatorManager.times;
    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.setProgress();
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  timeId(index: number, time: number) {
    return index + " " + time;
  }
  setProgress() {
    this.progress = !this.auto.on
      ? 0
      : Math.min(
          100,
          Math.floor(
            (0.1 * (Date.now() - this.auto.lastExec)) / this.auto.minInterval
          )
        );
  }
  onActivationChange() {
    if (!this.auto.on) this.auto.lastExec = Date.now();
  }
}

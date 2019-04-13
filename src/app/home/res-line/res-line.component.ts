import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { Resource } from "../../model/resource/resource";
import { OptionsService } from "../../options.service";
import { Subscription } from "rxjs";
import { MainService } from "../../main.service";

@Component({
  selector: "app-res-line",
  templateUrl: "./res-line.component.html",
  styleUrls: ["./res-line.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResLineComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() name: string;
  @Input() shape: string;
  @Input() operativity: number;
  @Input() isEnding: boolean;
  @Input() isNew: boolean;
  @Input() quantity: Decimal = new Decimal(0);
  @Input() c: Decimal;
  @Input() unit: Resource;
  @Input() cap = false;
  @Input() mods?: number;

  private subscriptions: Subscription[] = [];

  constructor(
    public os: OptionsService,
    public ms: MainService,
    private cd: ChangeDetectorRef
  ) {}

  setOp100() {
    this.unit.operativity = 100;
    this.ms.reload();
  }

  ngOnInit() {
    this.quantity = this.unit.quantity;

    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        if (!this.quantity.eq(this.unit.quantity)) {
          this.quantity = this.unit.quantity;
          this.cd.markForCheck();
        }
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}

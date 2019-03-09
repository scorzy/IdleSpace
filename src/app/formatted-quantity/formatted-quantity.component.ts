import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { OptionsService } from "../options.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-formatted-quantity",
  templateUrl: "./formatted-quantity.component.html",
  styleUrls: ["./formatted-quantity.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormattedQuantityComponent implements OnInit, OnDestroy {
  @Input() quantity: Decimal;
  @Input() integer = false;
  @Input() monospace = true;
  private subscriptions: Subscription[] = [];

  constructor(public os: OptionsService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscriptions.push(
      this.os.formatEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}

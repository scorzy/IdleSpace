import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy
} from "@angular/core";
import { MainService } from "../../main.service";
import { Action } from "../../model/actions/abstractAction";
import { Price } from "../../model/prices/price";
import { Subscription } from "rxjs";

@Component({
  selector: "app-buttons",
  templateUrl: "./buttons.component.html",
  styleUrls: ["./buttons.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonsComponent implements OnInit, OnDestroy {
  @Input() action: Action;
  @Input() buttonsOnly = false;

  minuteSkip = 1;
  canSkip = false;

  lastMaxBuy: Decimal;
  lastHalfBuy: Decimal;
  alertModal = false;
  alertQuantity = new Decimal(0);

  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}
  ngOnInit() {
    if (this.action) {
      // this.action.reloadUserPrices();
      // this.action.reloadAvailableTime();
      // this.checkSkip();
    }

    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        // this.action.reloadUserPrices();
        // this.action.reloadAvailableTime();
        // this.checkSkip();
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getPriceId(index, price: Price) {
    return price.spendable.id;
  }
  buy(quantity: Decimal) {
    this.action.buy(quantity);
    this.ms.reload();
    this.alertModal = false;
  }
  // checkSkip() {
  //   this.canSkip = false;
  //   if (!this.action.canBuy && this.skippable && this.showTime) {
  //     this.minuteSkip = Math.ceil(Math.max(this.action.availableIn / 60000, 1));
  //     this.canSkip = this.ms.game.time.quantity.gt(this.minuteSkip * 60);
  //   }
  // }
  skip() {
    // if (this.canSkip) this.ms.game.actMin.buy(new Decimal(this.minuteSkip));
  }
  onNumChange() {
    this.action.setNumWanted();
    this.action.reload();
  }
  getMaxBuy(): Decimal {
    if (!this.action.maxBuy.eq(this.lastMaxBuy)) {
      this.lastMaxBuy = this.action.maxBuy;
    }
    return this.lastMaxBuy;
  }
  getHalfBuy(): Decimal {
    const hlf = this.action.maxBuy.div(2).floor();
    if (!hlf.eq(this.lastHalfBuy)) {
      this.lastHalfBuy = hlf;
    }
    return this.lastHalfBuy;
  }
  buyOrModal(quantity: Decimal) {
    if (this.action.alertMessage) {
      this.alertQuantity = quantity;
      this.alertModal = true;
    } else {
      this.buy(quantity);
    }
  }
}

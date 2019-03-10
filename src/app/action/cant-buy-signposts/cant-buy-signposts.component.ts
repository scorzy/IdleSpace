import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit
} from "@angular/core";
import { MainService } from "../../main.service";
import { Action } from "src/app/model/actions/abstractAction";
import { Price } from "src/app/model/prices/price";
import { Subscription } from "rxjs";

@Component({
  selector: "app-cant-buy-signposts",
  templateUrl: "./cant-buy-signposts.component.html",
  styleUrls: ["./cant-buy-signposts.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CantBuySignpostsComponent implements OnInit, OnDestroy {
  @Input()
  action: Action;

  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}
  ngOnInit() {
    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  getVal(price: Price): number {
    return Math.floor(
      Math.min(
        price.spendable.quantity.div(price.singleCost).toNumber() * 100,
        100
      )
    );
  }
  getPriceId(index, price: Price) {
    return price.spendable.id;
  }
}

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { Production } from "../model/production";
import { Bonus } from "../model/bonus/bonus";
import { BonusStack } from "../model/bonus/bonusStack";

@Component({
  selector: "app-bonus-view",
  templateUrl: "./bonus-view.component.html",
  styleUrls: ["./bonus-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BonusViewComponent implements OnInit, OnChanges {
  @Input() production: Production;
  @Input() bonus: BonusStack;

  bonusAdd: Bonus[];
  bonusMulti: Bonus[];

  constructor() {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    if (this.production) {
      this.bonus = this.production.producer.productionMultiplier;
    }

    this.bonusAdd = this.bonus.additiveBonus.filter(
      t =>
        (!this.production || !t.positiveOnly || this.production.ratio.gt(0)) &&
        !t.base.getQuantity().eq(0)
    );
    this.bonusMulti = this.bonus.multiplicativeBonus
      .concat(
        this.production && this.production.productionMultiplier
          ? this.production.productionMultiplier.multiplicativeBonus
          : []
      )
      .filter(
        t =>
          (!this.production ||
            !t.positiveOnly ||
            this.production.ratio.gt(0)) &&
          !t.base.getQuantity().eq(0)
      );
  }

  bonusAddId(index: number, bonus: Bonus): string {
    return "add" + index + bonus.base.id;
  }
  bonusMulId(index: number, bonus: Bonus): string {
    return "mul" + index + bonus.base.id;
  }
}

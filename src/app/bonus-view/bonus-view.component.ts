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

@Component({
  selector: "app-bonus-view",
  templateUrl: "./bonus-view.component.html",
  styleUrls: ["./bonus-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BonusViewComponent implements OnInit, OnChanges {
  @Input() production: Production;
  bonusAdd: Bonus[];
  bonusMulti: Bonus[];

  constructor() {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    this.bonusAdd = this.production.producer.productionMultiplier.additiveBonus
      .concat(
        this.production.ratio.gt(0)
          ? this.production.producer.efficiencyMultiplier.additiveBonus
          : []
      )
      .filter(b => !b.base.quantity.eq(0));
    this.bonusMulti = this.production.producer.productionMultiplier.multiplicativeBonus
      .concat(
        this.production.ratio.gt(0)
          ? this.production.producer.efficiencyMultiplier.multiplicativeBonus
          : []
      )
      .concat(
        this.production.productionMultiplier
          ? this.production.productionMultiplier.multiplicativeBonus
          : []
      )
      .filter(b => !b.base.quantity.eq(0));
  }

  bonusAddId(index: number, bonus: Bonus): string {
    return "add" + index + bonus.base.id;
  }
  bonusMulId(index: number, bonus: Bonus): string {
    return "mul" + index + bonus.base.id;
  }
}

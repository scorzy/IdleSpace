import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  OnDestroy,
  ChangeDetectorRef,
  AfterViewInit
} from "@angular/core";
import { MainService } from "../main.service";
import { Subscription } from "rxjs";
import { AllSkillEffects } from "../model/prestige/allSkillEffects";
import { TERRAFORMER_MULTI } from "../model/enemy/enemyManager";

declare let preventScroll;

@Component({
  selector: "app-battle",
  templateUrl: "./battle.component.html",
  styleUrls: ["./battle.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleMenuComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding("class")
  contentContainer = "content-container";
  surrenderModal = false;
  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}
  private subscriptions: Subscription[] = [];

  totalDistrictGain = new Decimal(1);
  maxExtraTile = 0;

  ngOnInit() {
    let n = 1;
    this.maxExtraTile = this.ms.game.fleetManager.maxTilePerFight;
    this.ms.game.fleetManager.ships.forEach(s => {
      s.order = n;
      n++;
    });
    this.reloadDistrictStats();

    this.subscriptions.push(
      this.ms.em.battleEndEmitter.subscribe(() => {
        this.cd.markForCheck();
      }),
      this.ms.em.updateEmitter.subscribe(() => {
        this.reloadDistrictStats();
        this.cd.markForCheck();
      })
    );
  }
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  startBattle() {
    this.ms.game.enemyManager.startBattle();
  }
  surrender() {
    this.ms.game.enemyManager.surrender();
    this.surrenderModal = false;
  }
  nuke(num: Decimal) {
    this.ms.game.enemyManager.nukeAction.buy(num);
    this.ms.em.battleEndEmitter.emit(55);
  }
  reloadDistrictStats() {
    if (this.ms.game.enemyManager.currentEnemy) {
      let prestigeMulti = new Decimal(1).plus(
        this.ms.game.researchManager.scavenger.quantity.times(0.1)
      );
      prestigeMulti = prestigeMulti.times(
        AllSkillEffects.DOUBLE_BATTLE_GAIN.numOwned * 2 + 1
      );
      this.totalDistrictGain = prestigeMulti
        .times(this.ms.game.enemyManager.currentEnemy.level)
        .times(
          new Decimal(1).plus(
            this.ms.game.resourceManager.terraformer
              .getQuantity()
              .times(TERRAFORMER_MULTI)
          )
        )
        .times(AllSkillEffects.DOUBLE_DISTRICTS.numOwned + 1);
    } else {
      this.totalDistrictGain = new Decimal(0);
    }
  }
}

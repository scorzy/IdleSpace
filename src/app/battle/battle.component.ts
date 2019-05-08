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

  ngOnInit() {
    let n = 1;
    this.ms.game.fleetManager.ships.forEach(s => {
      s.order = n;
      n++;
    });

    this.subscriptions.push(
      this.ms.em.battleEndEmitter.subscribe(() => {
        this.cd.markForCheck();
      }),
      this.ms.em.updateEmitter.subscribe(() => {
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
}

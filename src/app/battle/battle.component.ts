import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import { MainService } from "../main.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-battle",
  templateUrl: "./battle.component.html",
  styleUrls: ["./battle.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BattleMenuComponent implements OnInit, OnDestroy {
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
      })
    );
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
}

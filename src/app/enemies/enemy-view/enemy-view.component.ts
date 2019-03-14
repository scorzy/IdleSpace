import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import { Enemy } from "src/app/model/enemy/enemy";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";
import { ActivatedRoute } from "@angular/router";
import { ShipDesign } from "src/app/model/fleet/shipDesign";
import { Module } from "src/app/model/fleet/module";

@Component({
  selector: "app-enemy-view",
  templateUrl: "./enemy-view.component.html",
  styleUrls: ["./enemy-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnemyViewComponent implements OnInit, OnDestroy {
  enemy: Enemy;
  private subscriptions: Subscription[] = [];

  constructor(
    public ms: MainService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(this.getEnemy.bind(this))
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  getEnemy(params: any) {
    this.enemy = null;
    const id = params.id;
    // == compare string and number !
    // tslint:disable-next-line:triple-equals
    const b = this.ms.game.enemyManager.allEnemy.find(u => u.id == id);
    if (b instanceof Enemy) this.enemy = b;
    this.cd.markForCheck();
  }
  getDesignId(index: number, ship: ShipDesign) {
    return (this.enemy ? this.enemy.id : "") + "-" + ship.id;
  }
  getModId(index: number, mod: Module) {
    return (this.enemy ? this.enemy.id : "") + "-" + mod.id;
  }
}

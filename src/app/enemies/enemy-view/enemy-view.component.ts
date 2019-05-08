import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  HostBinding,
  AfterViewInit
} from "@angular/core";
import { Enemy } from "src/app/model/enemy/enemy";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ShipDesign } from "src/app/model/fleet/shipDesign";
import { Module } from "src/app/model/fleet/module";
declare let preventScroll;
import { moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-enemy-view",
  templateUrl: "./enemy-view.component.html",
  styleUrls: ["./enemy-view.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnemyViewComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding("class")
  contentArea = "content-area";
  enemy: Enemy;
  private subscriptions: Subscription[] = [];
  deleteModal = false;

  constructor(
    public ms: MainService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(this.getEnemy.bind(this))
    );
  }
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
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
  attack() {
    const ret = this.ms.game.enemyManager.attack(this.enemy);
    if (ret) {
      this.router.navigateByUrl("/battle");
    }
  }
  move(up = 1) {
    const index = this.ms.game.enemyManager.allEnemy.indexOf(this.enemy);
    moveItemInArray(this.ms.game.enemyManager.allEnemy, index, index + up);
  }
  delete() {
    this.ms.game.enemyManager.delete(this.enemy);
    this.deleteModal = false;
    this.router.navigateByUrl("/enemies");
  }
}

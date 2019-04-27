import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy,
  OnChanges,
  AfterViewInit
} from "@angular/core";
import { Resource } from "../model/resource/resource";
import { Subscription } from "rxjs";
import { MainService } from "../main.service";
import { Action } from "../model/actions/abstractAction";
import { IAlert } from "../model/base/IAlert";
import { preventScroll } from "../app.component";
import { MISSILE_DAMAGE } from "../model/enemy/enemyManager";

@Component({
  selector: "app-resource-overview",
  templateUrl: "./resource-overview.component.html",
  styleUrls: ["./resource-overview.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceOverviewComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() res: Resource;
  private subscriptions: Subscription[] = [];
  alerts: IAlert[];
  isFinite = Number.isFinite;
  missileDamage = new Decimal(0);

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  ngOnInit() {
    if (this.res === this.ms.game.resourceManager.missile) {
      this.missileDamage = this.ms.game.enemyManager.missileDamageBonus
        .getTotalBonus()
        .times(MISSILE_DAMAGE);
    }

    this.setAlerts();
    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.setAlerts();
        if (this.res === this.ms.game.resourceManager.missile) {
          this.missileDamage = this.ms.game.enemyManager.missileDamageBonus
            .getTotalBonus()
            .times(MISSILE_DAMAGE);
        }
        this.cd.markForCheck();
      })
    );
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.setAlerts();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  setAlerts() {
    this.alerts =
      this.res && this.res.alerts
        ? this.res.alerts.filter(a => a.getCondition())
        : [];
  }

  getResId(index: number, base: Resource) {
    return base.id;
  }
  getActId(index: number, base: Action) {
    return base.id;
  }
  getAlertId(index: number, alert: IAlert) {
    return alert.id;
  }
}

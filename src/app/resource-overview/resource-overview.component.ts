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
declare let preventScroll;
import { MISSILE_DAMAGE } from "../model/enemy/enemyManager";
import { OptionsService } from "../options.service";
import { RefundAction } from "../model/actions/refundAction";

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
  unlockedActions = new Array<Action>();

  constructor(
    public ms: MainService,
    private cd: ChangeDetectorRef,
    public os: OptionsService
  ) {}
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  ngOnInit() {
    if (this.res === this.ms.game.resourceManager.missile) {
      this.missileDamage = this.ms.game.enemyManager.missileDamageBonus
        .getTotalBonus()
        .times(MISSILE_DAMAGE);
    }
    this.setActions();
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
  setActions() {
    this.unlockedActions = this.res.unlockedActions;
    if (this.os.hideRefund) {
      this.res.unlockedActions = this.res.unlockedActions.filter(
        a => !(a instanceof RefundAction)
      );
    }
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.setAlerts();
    this.setActions();
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

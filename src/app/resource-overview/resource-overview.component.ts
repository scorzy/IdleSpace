import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit,
  OnChanges
} from "@angular/core";
import { Resource } from "../model/resource/resource";
import { Subscription } from "rxjs";
import { MainService } from "../main.service";
import { Action } from "../model/actions/abstractAction";
import { IAlert } from "../model/base/IAlert";

@Component({
  selector: "app-resource-overview",
  templateUrl: "./resource-overview.component.html",
  styleUrls: ["./resource-overview.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceOverviewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() res: Resource;
  private subscriptions: Subscription[] = [];
  alerts: IAlert[];
  isFinite = Number.isFinite;

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.setAlerts();
    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.setAlerts();
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

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy,
  OnChanges
} from "@angular/core";
import { ResourceGroup } from "src/app/model/resource/resourceGroup";
import { MainService } from "src/app/main.service";
import { Subscription } from "rxjs";
import { MultiBuyAction } from "src/app/model/actions/multiBuyAction";
import { ResourceQuantitySorter } from "src/app/model/utility/resourceQuantitySorter";
import { LimitResourceSorter } from "src/app/model/utility/limitResourceSorter";
import { ExpansionResourceSorter } from "src/app/model/utility/expansionResourceSorter";
import { Action } from "src/app/model/actions/abstractAction";

@Component({
  selector: "app-resource-group",
  templateUrl: "./resource-group.component.html",
  styleUrls: ["./resource-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceGroupComponent implements OnInit, OnDestroy, OnChanges {
  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}
  @Input() resourceGroup: ResourceGroup;
  // unitsSpan = "";
  isSmall = false;
  operativity = 100;
  buyAction: Action;
  mineAction: Action;
  refundAction: Action;
  actions = new Array<Action>();
  resourceQuantitySorter = new ResourceQuantitySorter();
  limitResourceSorter = new LimitResourceSorter();
  expansionResourceSorter = new ExpansionResourceSorter();
  private subscriptions: Subscription[] = [];
  storage = false;

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.getGroup();
  }
  ngOnInit() {
    this.isSmall = window.innerWidth < 1200;
    this.getGroup();
    this.getOperativity();

    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.getOperativity();
        this.actions.forEach(a => a.reload());
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  getOperativity() {
    if (this.resourceGroup.unlockedResources[0].buyAction) {
      this.operativity =
        this.resourceGroup.selected.length > 0
          ? this.resourceGroup.selected
              .map(u => u.operativity)
              .reduce((p, c) => p + c, 0) / this.resourceGroup.selected.length
          : 0;
    }
  }
  selectedChanged(event: any) {
    this.getGroup();
  }
  changeOperativity(event: any) {
    this.resourceGroup.selected.forEach(u => {
      u.operativity = this.operativity;
    });
  }
  getGroup() {
    // this.unitsSpan = this.resourceGroup.unlockedResources
    //   .map(u => u.name)
    //   .reduce((p, c) => p + ", " + c);

    this.buyAction = null;
    this.mineAction = null;
    this.refundAction = null;
    this.actions = new Array<Action>();

    if (
      this.resourceGroup === this.ms.game.resourceManager.matGroup &&
      this.ms.game.resourceManager.energy.unlockedActions.length > 0
    ) {
      this.mineAction = this.ms.game.resourceManager.energy.actions[0];
      this.actions.push(this.mineAction);
      return true;
    }
    if (
      this.resourceGroup ===
      this.ms.game.resourceManager.tierGroups[
        this.ms.game.resourceManager.tierGroups.length - 1
      ]
    ) {
      return true;
    }

    if (this.resourceGroup.selected.length > 0) {
      this.buyAction = new MultiBuyAction(
        this.resourceGroup.selected.map(r => r.buyAction)
      );
      this.actions.push(this.buyAction);
      this.buyAction.name = "Buy Robots";

      if (this.resourceGroup === this.ms.game.resourceManager.tierGroups[1]) {
        this.mineAction = new MultiBuyAction(
          this.resourceGroup.selected.map(r => r.actions[1])
        );
        this.actions.push(this.mineAction);
        this.mineAction.name = "Increase Robot Storage";
      }

      const refundActions = this.resourceGroup.selected
        .filter(r => r.refundAction)
        .map(r => r.refundAction);
      if (refundActions.length > 0) {
        this.refundAction = new MultiBuyAction(refundActions);
        this.actions.push(this.refundAction);
        this.refundAction.name = "Refund";
        this.refundAction.alertMessage = "Refund all selected resources?";
      }
    }
    this.actions.forEach(a => a.reload());
  }
  getActId(index: number, base: Action) {
    return base.id + index;
  }
}

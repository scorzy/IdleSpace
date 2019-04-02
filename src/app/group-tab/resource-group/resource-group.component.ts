import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { ResourceGroup } from "src/app/model/resource/resourceGroup";
import { MainService } from "src/app/main.service";
import { Subscription } from "rxjs";
import { MultiBuyAction } from "src/app/model/actions/multiBuyAction";
import { ResourceQuantitySorter } from "src/app/model/utility/resourceQuantitySorter";
import { LimitResourceSorter } from "src/app/model/utility/limitResourceSorter";
import { ExpansionResourceSorter } from "src/app/model/utility/expansionResourceSorter";

@Component({
  selector: "app-resource-group",
  templateUrl: "./resource-group.component.html",
  styleUrls: ["./resource-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceGroupComponent implements OnInit, OnDestroy {
  @Input() resourceGroup: ResourceGroup;
  unitsSpan = "";
  isSmall = false;
  operativity = 100;
  buyAction: MultiBuyAction;
  mineAction: MultiBuyAction;
  refundAction: MultiBuyAction;
  resourceQuantitySorter = new ResourceQuantitySorter();
  limitResourceSorter = new LimitResourceSorter();
  expansionResourceSorter = new ExpansionResourceSorter();
  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.isSmall = window.innerWidth < 1200;
    this.getGroup();
    this.getOperativity();

    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.getOperativity();
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
    this.unitsSpan = this.resourceGroup.unlockedResources
      .map(u => u.name)
      .reduce((p, c) => p + ", " + c);

    this.buyAction = null;
    this.mineAction = null;
    this.refundAction = null;
  }
}

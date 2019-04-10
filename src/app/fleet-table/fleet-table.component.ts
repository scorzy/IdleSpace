import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import { ShipDesign } from "../model/fleet/shipDesign";
import { ShipTypeSorter } from "../model/utility/shipTypeSorter";
import { ShipQuantitySorter } from "../model/utility/shipQuantitySorter";
import { Subscription } from "rxjs";
import { MainService } from "../main.service";
import { ShipOrderSorter } from "../model/utility/shipOrderSorter";

@Component({
  selector: "app-fleet-table",
  templateUrl: "./fleet-table.component.html",
  styleUrls: ["./fleet-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FleetTableComponent implements OnInit, OnDestroy {
  @Input() fleet: ShipDesign[];
  shipTypeSorter = new ShipTypeSorter();
  shipQuantitySorter = new ShipQuantitySorter();
  shipOrderSorter = new ShipOrderSorter();

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  getDesignId(index: number, ship: ShipDesign) {
    return ship.id;
  }
}

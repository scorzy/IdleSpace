import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ShipDesign } from "src/app/model/fleet/shipDesign";
import { ShipTypes, ShipType } from "src/app/model/fleet/shipTypes";
import { ResearchManager } from "src/app/model/research/researchManager";
import { MAX_DESIGN } from "src/app/model/fleet/fleetManager";
import { ShipClass, Classes } from "src/app/model/fleet/class";
declare let preventScroll;

@Component({
  selector: "app-design",
  templateUrl: "./design.component.html",
  styleUrls: ["./design.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignComponent implements OnInit, OnDestroy, AfterViewInit {
  design: ShipDesign;

  name = "";
  id = "";
  type = "1";
  class = "";

  unlockedShips: ShipType[] = [];
  unlockedClasses: ShipClass[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    public ms: MainService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  ngOnInit() {
    this.ms.hotkeyEnabled = false;
    this.unlockedShips = [];
    if (ResearchManager.getInstance().corvette.firstDone) {
      this.unlockedShips.push(ShipTypes[0]);
    }
    if (ResearchManager.getInstance().frigate.firstDone) {
      this.unlockedShips.push(ShipTypes[1]);
    }
    if (ResearchManager.getInstance().destroyer.firstDone) {
      this.unlockedShips.push(ShipTypes[2]);
    }
    if (ResearchManager.getInstance().cruiser.firstDone) {
      this.unlockedShips.push(ShipTypes[3]);
    }
    if (ResearchManager.getInstance().battlecruiser.firstDone) {
      this.unlockedShips.push(ShipTypes[4]);
    }
    if (ResearchManager.getInstance().battleship.firstDone) {
      this.unlockedShips.push(ShipTypes[5]);
    }
    const maxTitan = ResearchManager.getInstance().titan.quantity.toNumber();
    for (let i = 0; i < maxTitan; i++) {
      this.unlockedShips.push(ShipType.GetTitan(i));
    }
    this.unlockedClasses = Classes.filter(c => c.unlocked);

    this.type = "1";
    this.subscriptions.push(
      this.route.params.subscribe(this.getDesign.bind(this))
    );
  }
  ngOnDestroy() {
    this.ms.hotkeyEnabled = true;
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  generate() {
    if (this.isDisabled()) return false;

    const shipType = this.unlockedShips.find(t => t.id === this.type);
    const shipClass = Classes.find(c => c.id === this.class);
    const design = this.ms.game.fleetManager.addDesign(
      this.name,
      shipType,
      shipClass
    );

    this.router.navigate(["/fleet/design/" + design.id]);
  }

  getDesign(params: any) {
    this.design = null;

    let id = params.id;
    if (id === undefined) {
      id = "";
    }
    const b = this.ms.game.fleetManager.ships.find(u => u.id === id);
    if (b) this.design = b;

    this.cd.markForCheck();
  }

  typeId(index: number, shipType: ShipType) {
    return shipType.id;
  }
  isDisabled(): boolean {
    return (
      this.ms.game.fleetManager.ships.length >= MAX_DESIGN ||
      !(this.name.trim() !== "" && this.type.length > 0)
    );
  }
}

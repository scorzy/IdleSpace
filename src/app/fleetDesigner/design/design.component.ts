import {
  Component,
  OnInit,
  HostBinding,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";
import { ActivatedRoute } from "@angular/router";
import { ShipDesign } from "src/app/model/fleet/shipDesign";
import { ShipTypes, ShipType } from "src/app/model/fleet/shipTypes";

@Component({
  selector: "app-design",
  templateUrl: "./design.component.html",
  styleUrls: ["./design.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DesignComponent implements OnInit {
  @HostBinding("class")
  contentArea = "content-area";
  design: ShipDesign;

  name = "";
  id = "";
  type = "";

  ShipTypes = ShipTypes;

  private subscriptions: Subscription[] = [];

  constructor(
    public ms: MainService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(this.getDesign.bind(this))
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  generate() {
    const shipType = ShipTypes.find(t => t.id === this.type);
    const design = this.ms.game.fleetManager.addDesign(this.name, shipType);
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
}

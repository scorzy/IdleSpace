import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";
import { MainService } from "../main.service";
import { ShipDesign } from "../model/fleet/shipDesign";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-fleet-designer",
  templateUrl: "./fleetDesigner.component.html",
  styleUrls: ["./fleetDesigner.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FleetDesignerComponent implements OnInit {
  @HostBinding("class")
  contentContainer = "content-container";

  constructor(public ms: MainService) {}

  ngOnInit() {}

  designId(index: number, data: ShipDesign) {
    return data.id;
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.ms.game.fleetManager.ships,
      event.previousIndex,
      event.currentIndex
    );
  }
}

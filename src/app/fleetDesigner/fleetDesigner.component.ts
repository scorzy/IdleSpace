import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  AfterViewInit
} from "@angular/core";
import { MainService } from "../main.service";
import { ShipDesign } from "../model/fleet/shipDesign";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
declare let preventScroll;

@Component({
  selector: "app-fleet-designer",
  templateUrl: "./fleetDesigner.component.html",
  styleUrls: ["./fleetDesigner.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FleetDesignerComponent implements OnInit, AfterViewInit {
  @HostBinding("class")
  contentContainer = "content-container";

  constructor(public ms: MainService) {}

  ngOnInit() {}
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
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

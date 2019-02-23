import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef
} from "@angular/core";
import { ShipDesign } from "src/app/model/fleet/shipDesign";
import { Module } from "src/app/model/fleet/module";
import { MainService } from "src/app/main.service";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent implements OnInit, OnChanges {
  @Input() design: ShipDesign;

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.design) this.design.copy();
  }
  ngOnInit() {}

  getModuleId(index: number, module: Module) {
    return module.id + " " + index;
  }
  addWeapon() {
    this.design.addWeapon();
    this.reload();
  }
  removeWeapon(i: number) {
    this.design.removeWeapon(i);
    this.reload();
  }
  reload() {
    this.design.editable.weapons.forEach(w => {
      w.module = this.ms.game.fleetManager.unlockedWeapons.find(
        q => q.id === w.moduleId
      );
      w.quantity = new Decimal(w.quantityUi);
    });
    this.design.editable.utility.forEach(w => {
      w[0] = new Decimal(w[2]);
    });

    this.design.editable.reload();
    this.ms.em.designEmitter.emit(1);
  }
}

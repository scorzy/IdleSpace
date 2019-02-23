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
import { Module, Sizes, getSizeName } from "src/app/model/fleet/module";
import { MainService } from "src/app/main.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent implements OnInit, OnChanges {
  @Input() design: ShipDesign;

  getSizeName = getSizeName;
  deleteModal = false;

  constructor(
    public ms: MainService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (this.design) this.design.copy();
  }
  ngOnInit() {}

  addModule() {
    this.design.addModule();
    this.reload();
  }
  removeModule(i: number) {
    this.design.removeModule(i);
    this.reload();
  }
  reload() {
    this.design.editable.modules.forEach(w => {
      w.module = this.ms.game.fleetManager.unlockedModules.find(
        q => q.id === w.moduleId
      );
      w.quantityUi = Math.max(w.quantityUi, 1);
      w.quantityUi = Math.min(w.quantityUi, this.design.type.moduleCount);
      w.quantity = w.quantityUi;
    });

    this.design.editable.reload();
    this.ms.em.designEmitter.emit(1);
  }
  deleteDesign() {
    this.ms.game.fleetManager.deleteDesign(this.design);
    this.router.navigate(["/fleet/design"]);
  }
  getModuleId(index: number, module: Module) {
    return module.id + " " + index;
  }
  getSizeId(index: number, size: Sizes) {
    return size;
  }
}

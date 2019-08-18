import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { ShipDesign } from "src/app/model/fleet/shipDesign";
import { Module, Sizes, getSizeName } from "src/app/model/fleet/module";
import { MainService } from "src/app/main.service";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { DesignLine } from "src/app/model/fleet/designLine";
declare let preventScroll;

@Component({
  selector: "app-editor",
  templateUrl: "./editor.component.html",
  styleUrls: ["./editor.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() design: ShipDesign;

  getSizeName = getSizeName;
  deleteModal = false;
  changed = false;
  canUpgrade = false;
  private subscriptions: Subscription[] = [];
  titanSizes = [];
  shipNum = 1;

  weapons: Module[] = [];
  defenses: Module[] = [];
  generators: Module[] = [];
  damageReduction: Module[] = [];
  other: Module[] = [];
  drives: Module[] = [];

  constructor(
    public ms: MainService,
    private cd: ChangeDetectorRef,
    private router: Router
  ) {}
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.setClasses();
    if (this.design) this.design.copy();
    if (this.design.modules.length === 0) {
      this.edit();
    }
  }
  ngOnInit() {
    this.ms.game.fleetManager.isUsed = true;
    this.ms.hotkeyEnabled = false;
    this.shipNum = Number.parseInt(this.design.type.id, 10);
    if (this.shipNum > 6) {
      for (let i = Math.max(this.shipNum - 12, 1); i < this.shipNum - 1; i++) {
        this.titanSizes.push(i);
      }
    }
    if (this.design.modules.length === 0) {
      this.edit();
    }

    this.defenses = this.ms.game.fleetManager.unlockedModules.filter(
      m => m.armor.gt(0) || m.shield.gt(0)
    );
    this.generators = this.ms.game.fleetManager.unlockedModules.filter(m =>
      m.energyBalance.gt(0)
    );
    this.damageReduction = this.ms.game.fleetManager.unlockedModules.filter(
      m => m.armorReduction.gt(0) || m.shieldReduction.gt(0)
    );
    this.drives = this.ms.game.fleetManager.unlockedModules.filter(
      m => m.tilePerSec > 0
    );

    this.setClasses();

    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.ms.game.fleetManager.isUsed = false;
    this.ms.hotkeyEnabled = true;
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  setClasses() {
    if (
      !this.design.class ||
      (this.design.class.id !== "4" && this.design.class.id !== "5")
    ) {
      this.weapons = this.ms.game.fleetManager.unlockedModules.filter(m =>
        m.damage.gt(0)
      );
    }
    if (this.design.class && this.design.class.id === "4") {
      this.other = this.ms.game.fleetManager.allModules.filter(m =>
        m.shieldCharge.gt(0)
      );
    }
  }
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

      w.setMaxLevel();
      w.level = Math.max(Math.min(w.levelUi, w.maxLevel), 1);
    });

    this.design.editable.reload();
    this.design.editable.isValid =
      this.design.editable.isValid &&
      this.design.editable.modules.findIndex(m => this.validateLevel(m)) === -1;
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
  save() {
    // if (!this.canUpgrade) return false;

    const ret = this.design.saveConfig();
    this.ms.em.designEmitter.emit(5);
    if (ret) {
      this.router.navigate(["/fleet/shipyard"]);
    } else {
      this.cd.markForCheck();
    }
  }
  revert() {
    if (this.design) this.design.copy();
    this.reload();
  }
  edit() {
    if (this.design) this.design.copy();
  }
  maxAll() {
    this.design.maxAll();
    this.reload();
  }
  validateLevel(w: DesignLine) {
    return !(w.levelUi >= 10 && w.levelUi <= w.maxLevel);
  }
}

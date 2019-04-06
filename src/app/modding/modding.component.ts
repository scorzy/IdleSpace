import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { Resource } from "../model/resource/resource";
import { Mod } from "../model/mod/mod";
import { MainService } from "../main.service";

@Component({
  selector: "app-modding",
  templateUrl: "./modding.component.html",
  styleUrls: ["./modding.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModdingComponent implements OnInit, OnChanges {
  @Input() res: Resource;
  isValid = true;
  used = 0;
  total: Decimal;
  max = 0;
  min = 0;
  constructor(public ms: MainService) {}

  ngOnInit() {
    this.cancel();
    this.reload();
  }
  ngOnChanges(changes: SimpleChanges) {
    this.reload();
  }
  save() {
    this.res.saveMods();
  }
  cancel() {
    this.res.modStack.mods.forEach(m => {
      m.quantity_ui = m.quantity.toNumber();
    });
  }
  reload() {
    this.isValid = this.res.modStack.validate();
    this.total = this.res.modStack.getMax();
    this.used = this.res.modStack.getTotal();
    this.max = this.ms.game.researchManager.modding.quantity.toNumber();
    this.min = Math.ceil(this.max / -2);
  }
  modID(index: number, mod: Mod) {
    return mod.id + index;
  }
}

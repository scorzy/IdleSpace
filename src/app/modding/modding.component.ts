import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  OnChanges,
  SimpleChanges,
  AfterViewInit
} from "@angular/core";
import { Resource } from "../model/resource/resource";
import { Mod } from "../model/mod/mod";
import { MainService } from "../main.service";
import { preventScroll } from "../app.component";

@Component({
  selector: "app-modding",
  templateUrl: "./modding.component.html",
  styleUrls: ["./modding.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModdingComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() res: Resource;
  isValid = true;
  used = 0;
  max = 0;
  min = 0;
  constructor(public ms: MainService) {}
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
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
    this.used = this.res.modStack.getTotalUsed();
    this.max = this.res.modStack.maxPoints.toNumber();
    this.min = Math.ceil(this.max / -2);
  }
  modID(index: number, mod: Mod) {
    return mod.id + index;
  }
  getMin(mod: Mod): number {
    return Math.max(mod.min, this.min);
  }
  getMax(mod: Mod): number {
    return Math.min(mod.max, this.max);
  }
}

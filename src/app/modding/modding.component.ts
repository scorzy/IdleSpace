import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { Resource } from "../model/resource/resource";
import { Mod } from "../model/mod/mod";
import { MainService } from "../main.service";
declare let preventScroll;
import { Subscription } from "rxjs";

@Component({
  selector: "app-modding",
  templateUrl: "./modding.component.html",
  styleUrls: ["./modding.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModdingComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() res: Resource;
  isValid = true;
  used = 0;
  max = 0;
  min = 0;
  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  ngOnInit() {
    this.cancel();
    this.reload();
    this.ms.em.updateEmitter.subscribe(() => {
      this.reload();
      this.cd.markForCheck();
    });
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
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
    return mod.resId + mod.id + index;
  }
  getMin(mod: Mod): number {
    return Math.max(mod.min, this.min);
  }
  getMax(mod: Mod): number {
    return Math.min(
      mod.max,
      this.max,
      mod.quantity_ui + this.res.modStack.maxPoints.toNumber() - this.used
    );
  }
}

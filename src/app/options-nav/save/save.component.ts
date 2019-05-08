import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  AfterViewInit,
  ChangeDetectorRef
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { Subscription } from "rxjs";
import { OptionsService } from "src/app/options.service";
declare let preventScroll;

@Component({
  selector: "app-save",
  templateUrl: "./save.component.html",
  styleUrls: ["./save.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaveComponent implements OnInit, OnDestroy, AfterViewInit {
  clearModal = false;
  exp = "";
  private subscriptions: Subscription[] = [];

  constructor(
    public ms: MainService,
    public os: OptionsService,
    private cd: ChangeDetectorRef
  ) {
    // Nothing
  }
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  ngOnInit() {
    this.subscriptions.push(
      this.ms.em.saveEmitter.subscribe(s => this.cd.markForCheck()),
      this.ms.em.zipEmitter.subscribe(s => {
        this.exp = s;
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  export() {
    this.ms.export();
  }
  import() {
    this.ms.import(this.exp.trim());
  }
  changeAutoSave() {
    this.ms.startAutoSave();
  }
  submit() {
    this.ms.sendKong(true);
  }
}

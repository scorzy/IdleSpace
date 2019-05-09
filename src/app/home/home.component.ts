import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  ChangeDetectorRef,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { MainService } from "../main.service";
import { ResourceGroup } from "../model/resource/resourceGroup";
import { Subscription } from "rxjs";
import { Resource } from "../model/resource/resource";
declare let preventScroll;

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding("class")
  contentContainer = "content-container";
  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) {
      preventScroll();
    }
  }
  ngOnInit() {
    this.reload();
    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.reload();
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getGroupId(index, list: ResourceGroup) {
    return list.id;
  }
  getResId(index, res: Resource) {
    return res.id;
  }
  reload() {
    this.ms.game.resourceManager.unlockedResources
      .filter(r => r.modStack)
      .forEach(r => {
        r.modStack.reload();
      });
  }
}

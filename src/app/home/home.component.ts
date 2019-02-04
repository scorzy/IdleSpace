import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { MainService } from "../main.service";
import { ResourceGroup } from "../model/resource/resourceGroup";
import { Subscription } from "rxjs";
import { Resource } from "../model/resource/resource";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent implements OnInit, OnDestroy {
  @HostBinding("class")
  contentContainer = "content-container";
  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
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
}

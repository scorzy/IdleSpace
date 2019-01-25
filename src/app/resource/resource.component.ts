import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  HostBinding
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "../main.service";
import { ActivatedRoute } from "@angular/router";
import { Resource } from "../model/resource/resource";

@Component({
  selector: "app-resource",
  templateUrl: "./resource.component.html",
  styleUrls: ["./resource.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceComponent implements OnInit, OnDestroy {
  @HostBinding("class")
  contentArea = "content-area";

  private subscriptions: Subscription[] = [];

  public res: Resource;

  constructor(
    public ms: MainService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(this.getUnit.bind(this))
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getUnit(params: any) {
    let id = params.id;
    if (id === undefined) {
      id = this.ms.game.resourceManager.metal.id;
    }
    const b = this.ms.game.resourceManager.unlockedResources.find(
      u => u.id === id
    );
    if (b instanceof Resource) {
      this.res = b;
      this.res.isNew = false;
      this.ms.lastUnitUrl = "prod/res/" + b.id;
    }
    this.cd.markForCheck();
  }
}

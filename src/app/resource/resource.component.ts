import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  HostBinding,
  AfterViewInit
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "../main.service";
import { ActivatedRoute } from "@angular/router";
import { Resource } from "../model/resource/resource";
declare let preventScroll;
import { Automator } from "../model/automators/automator";

@Component({
  selector: "app-resource",
  templateUrl: "./resource.component.html",
  styleUrls: ["./resource.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResourceComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding("class")
  contentArea = "content-area";

  private subscriptions: Subscription[] = [];
  res: Resource;

  constructor(
    public ms: MainService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
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
    let b: Resource;

    b =
      id !== "da"
        ? this.ms.game.resourceManager.unlockedResources.find(u => u.id === id)
        : (b = this.ms.game.darkMatterManager.darkMatter);

    if (b instanceof Resource) {
      this.res = b;
      this.res.isNew = false;
      this.ms.lastUnitUrl = "home/res/" + b.id;
    }
    this.cd.markForCheck();
  }

  autoId(index: number, automator: Automator): string {
    return automator.id;
  }
}

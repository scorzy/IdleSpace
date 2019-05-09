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
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { ResourceGroup } from "../model/resource/resourceGroup";
declare let preventScroll;
import { Automator } from "../model/automators/automator";

@Component({
  selector: "app-group-tab",
  templateUrl: "./group-tab.component.html",
  styleUrls: ["./group-tab.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupTabComponent implements OnInit, OnDestroy, AfterViewInit {
  @HostBinding("class")
  contentArea = "content-area";
  paramsSub: any;
  paramsSave: any;
  unitGroup: ResourceGroup;

  private subscriptions: Subscription[] = [];

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
      this.route.params.subscribe(this.getGroup.bind(this))
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  getGroup(params: any) {
    this.paramsSave = params;
    let id = "" + params.id;
    if (id === undefined) id = "0";
    this.unitGroup = this.ms.game.resourceManager.tierGroups.find(
      g => "" + g.id === id
    );
    if (!this.unitGroup) {
      this.unitGroup = this.ms.game.resourceManager.tierGroups[0];
    }
    if (!this.unitGroup) return;

    this.ms.lastUnitUrl = "home/group/" + this.unitGroup.id;

    // this.bugs = uniq(this.unitGroup.unlocked.map(u => u.bugType));

    this.cd.markForCheck();
  }
  autoId(index: number, auto: Automator) {
    return auto.id;
  }
}

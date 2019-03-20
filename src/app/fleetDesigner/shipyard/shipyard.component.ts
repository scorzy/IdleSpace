import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { Subscription } from "rxjs";
import { MainService } from "src/app/main.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Job } from "src/app/model/shipyard/job";

@Component({
  selector: "app-shipyard",
  templateUrl: "./shipyard.component.html",
  styleUrls: ["./shipyard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipyardComponent implements OnInit, OnDestroy {
  @HostBinding("class")
  contentArea = "content-area";

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
  getJobId(index: number, job: Job) {
    return job.id.toString();
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.ms.game.shipyard.jobs,
      event.previousIndex,
      event.currentIndex
    );
  }
}

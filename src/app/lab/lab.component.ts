import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  ChangeDetectorRef,
  OnDestroy
} from "@angular/core";
import { MainService } from "../main.service";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { Research } from "../model/research/research";
import { Subscription } from "rxjs";

@Component({
  selector: "app-lab",
  templateUrl: "./lab.component.html",
  styleUrls: ["./lab.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabComponent implements OnInit, OnDestroy {
  @HostBinding("class")
  contentContainer = "content-container";
  resMulti = new Decimal(1);
  resPerSec = new Decimal(1);

  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.resMulti = this.ms.game.researchBonus.getTotalBonus();
        this.resPerSec = this.resMulti.times(
          this.ms.game.resourceManager.computing.c
        );
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  getResId(index: number, res: Research) {
    return res.id;
  }
  sortPrice() {
    this.ms.game.researchManager.toDo.sort((a, b) =>
      a.total.minus(b.total).toNumber()
    );
  }
}

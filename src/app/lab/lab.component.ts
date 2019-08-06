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
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import { Research } from "../model/research/research";
import { Subscription } from "rxjs";
declare let preventScroll;

@Component({
  selector: "app-lab",
  templateUrl: "./lab.component.html",
  styleUrls: ["./lab.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LabComponent implements OnInit, OnDestroy, AfterViewInit {
  resMulti = new Decimal(1);
  resPerSec = new Decimal(1);
  infoModal = false;
  bonus = false;

  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  ngOnInit() {
    this.ms.game.researchManager.isNew = false;
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
    this.ms.game.researchManager.sortPrice();
  }
  allBacklog() {
    this.ms.game.researchManager.backLog = this.ms.game.researchManager.backLog.concat(
      this.ms.game.researchManager.toDo
    );
    this.ms.game.researchManager.toDo = [];
  }
  allToDo() {
    this.ms.game.researchManager.toDo = this.ms.game.researchManager.toDo.concat(
      this.ms.game.researchManager.backLog
    );
    this.ms.game.researchManager.backLog = [];
  }
}

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";
import { MainService } from "../main.service";
import { Enemy } from "../model/enemy/enemy";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";

@Component({
  selector: "app-enemies",
  templateUrl: "./enemies.component.html",
  styleUrls: ["./enemies.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnemiesComponent implements OnInit {
  @HostBinding("class")
  contentArea = "content-area";

  constructor(public ms: MainService) {}

  ngOnInit() {}
  generate() {
    this.ms.game.enemyManager.generate();
  }
  getEnemyId(index: number, enemy: Enemy) {
    return enemy.id;
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.ms.game.researchManager.toDo,
      event.previousIndex,
      event.currentIndex
    );
  }

  // drop(event: CdkDragDrop<Enemy[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // }
}

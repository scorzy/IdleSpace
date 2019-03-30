import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  ChangeDetectorRef
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { SearchJob } from "src/app/model/enemy/searchJob";
import { MAX_ENEMY_LIST_SIZE } from "src/app/model/enemy/enemyManager";
import { Subscription } from "rxjs";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {
  @HostBinding("class")
  contentArea = "content-area";
  userLevel = 1;
  searchValid = true;
  valid = true;
  limited = false;
  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.userLevel = this.ms.game.enemyManager.maxLevel;
    this.validate();

    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.validate();
        this.cd.markForCheck();
      })
    );
  }

  generate() {
    this.ms.game.enemyManager.startSearching(this.userLevel);
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.ms.game.enemyManager.searchJobs,
      event.previousIndex,
      event.currentIndex
    );
  }
  getJobId(index: number, job: SearchJob) {
    return job.id.toString();
  }
  validate() {
    this.limited =
      this.ms.game.enemyManager.getTotalEnemy() < MAX_ENEMY_LIST_SIZE;
    this.valid = this.isValid();
  }
  isValid(): boolean {
    return (
      this.ms.game.enemyManager.getTotalEnemy() < MAX_ENEMY_LIST_SIZE &&
      (Number.isInteger(this.userLevel) &&
        this.userLevel >= 1 &&
        this.userLevel <= this.ms.game.enemyManager.maxLevel)
    );
  }
}

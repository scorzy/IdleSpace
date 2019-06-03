import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { SearchJob } from "src/app/model/enemy/searchJob";
import {
  MAX_ENEMY_LIST_SIZE,
  EnemyManager
} from "src/app/model/enemy/enemyManager";
import { Subscription } from "rxjs";
import { AllSkillEffects } from "src/app/model/prestige/allSkillEffects";
declare let preventScroll;
@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding("class")
  contentArea = "content-area";
  searchValid = true;
  valid = true;
  limited = false;
  deleteModal = false;
  moreSearch = false;
  metal = false;
  cry = false;
  hab = false;
  hab2 = false;
  rand = false;
  automatorTab = false;
  deleteAllModal = false;
  EnemyManager = EnemyManager;
  bonusCount = 0;

  private subscriptions: Subscription[] = [];

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.automatorTab =
      this.ms.game.automatorManager.searchAutomators.findIndex(a =>
        a.isUnlocked()
      ) > -1;

    this.moreSearch =
      AllSkillEffects.SEARCH_CRY.numOwned > 0 ||
      AllSkillEffects.SEARCH_METAL.numOwned > 0 ||
      AllSkillEffects.SEARCH_HAB.numOwned > 0;

    this.metal = AllSkillEffects.SEARCH_METAL.numOwned > 0;
    this.cry = AllSkillEffects.SEARCH_CRY.numOwned > 0;
    this.hab = AllSkillEffects.SEARCH_HAB.numOwned > 0;
    this.hab2 = AllSkillEffects.SEARCH_HAB2.numOwned > 0;
    this.rand = AllSkillEffects.SEARCH_RANDOM.numOwned > 0;

    this.validate();

    this.subscriptions.push(
      this.ms.em.updateEmitter.subscribe(() => {
        this.validate();
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
  }
  generate() {
    this.ms.game.enemyManager.startSearching(this.ms.game.userSearchLevel);
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
    this.bonusCount =
      (this.ms.game.enemyManager.moreMetal ? 1 : 0) +
      (this.ms.game.enemyManager.moreCrystal ? 1 : 0) +
      (this.ms.game.enemyManager.moreHabitable ? 1 : 0) +
      (this.ms.game.enemyManager.moreHabitable2 ? 1 : 0);
  }
  isValid(): boolean {
    return (
      this.ms.game.enemyManager.getTotalEnemy() < MAX_ENEMY_LIST_SIZE &&
      (Number.isInteger(this.ms.game.userSearchLevel) &&
        this.ms.game.userSearchLevel >= 1 &&
        this.ms.game.userSearchLevel <= this.ms.game.enemyManager.maxLevel)
    );
  }
  sortAsc() {
    this.ms.game.enemyManager.allEnemy.sort((a, b) => a.level - b.level);
  }
  sortDesc() {
    this.ms.game.enemyManager.allEnemy.sort((a, b) => b.level - a.level);
  }
  massDelete() {
    this.ms.game.enemyManager.allEnemy = this.ms.game.enemyManager.allEnemy.filter(
      a => a.level >= this.ms.game.userSearchLevel
    );
    this.deleteModal = false;
  }
  deleteAll() {
    this.ms.game.enemyManager.allEnemy = [];
    this.deleteAllModal = false;
  }
}

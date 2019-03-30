import { Enemy } from "./enemy";
import { ISalvable } from "../base/ISalvable";
import { BattleService } from "src/app/battle.service";
import { FleetManager } from "../fleet/fleetManager";
import { BattleRequest } from "src/app/workers/battleRequest";
import { Reward } from "./reward";
import { ResourceManager } from "../resource/resourceManager";
import { Emitters } from "src/app/emitters";
import { SearchJob } from "./searchJob";
import { RomanPipe } from "src/app/roman.pipe";

export const MAX_ENEMY_LIST_SIZE = 20;

export class EnemyManager implements ISalvable {
  private static instance: EnemyManager;

  static romanPipe = new RomanPipe();

  currentEnemy: Enemy;
  allEnemy = new Array<Enemy>();
  maxLevel = 1;
  battleService: BattleService;
  inBattle = false;

  searchJobs = new Array<SearchJob>();

  static getInstance(): EnemyManager {
    return EnemyManager.instance;
  }
  constructor() {
    EnemyManager.instance = this;
  }
  generate(searchJob: SearchJob) {
    this.allEnemy.push(Enemy.generate(searchJob.level));
  }

  attack(enemy: Enemy): boolean {
    if (this.currentEnemy) return false;
    this.currentEnemy = enemy;
    this.allEnemy = this.allEnemy.filter(e => e !== enemy);
    this.currentEnemy.generateZones();
    return true;
  }

  startBattle() {
    if (this.inBattle || !this.currentEnemy) return false;

    Emitters.getInstance().battleEndEmitter.emit(1);
    this.inBattle = true;
    FleetManager.getInstance().reload();
    this.currentEnemy.currentZone.reload();

    const battleRequest = new BattleRequest();
    battleRequest.playerFleet = FleetManager.getInstance().ships.map(s =>
      s.getShipData()
    );
    battleRequest.enemyFleet = this.currentEnemy.currentZone.ships.map(s =>
      s.getShipData()
    );
    this.battleService.battleWorker.postMessage(battleRequest);
  }
  onBattleEnd(result: BattleResult) {
    // console.log("On Battle End");
    result.enemyLost.forEach(e => {
      const ship = this.currentEnemy.currentZone.ships.find(s => s.id === e[0]);
      ship.quantity = ship.quantity.minus(Decimal.fromDecimal(e[1]));
    });
    result.playerLost.forEach(e => {
      const ship = FleetManager.getInstance().ships.find(s => s.id === e[0]);
      ship.quantity = ship.quantity.minus(Decimal.fromDecimal(e[1]));
    });
    this.currentEnemy.currentZone.reload();

    //#region Win
    if (result.result === "1") {
      this.maxLevel = Math.max(this.maxLevel, this.currentEnemy.level + 1);
      this.currentEnemy.currentZone.ships = null;
      this.currentEnemy.currentZone.originalNavCap = null;
      //#region Reward
      const currentZone = this.currentEnemy.currentZone;
      const resMan = ResourceManager.getInstance();
      if (currentZone.reward) {
        switch (currentZone.reward) {
          case Reward.HabitableSpace:
            resMan.habitableSpace.quantity = resMan.habitableSpace.quantity.plus(
              this.currentEnemy.level
            );
            break;
          case Reward.MetalMine:
            resMan.miningDistrict.quantity = resMan.miningDistrict.quantity.plus(
              this.currentEnemy.level
            );
            break;
          case Reward.CrystalMine:
            resMan.crystalDistrict.quantity = resMan.crystalDistrict.quantity.plus(
              this.currentEnemy.level
            );
            break;
        }
      }
      //#endregion
      if (this.currentEnemy.currentZone.number >= 99) {
        this.currentEnemy = null;
        if (this.allEnemy.length > 0) this.attack(this.allEnemy[0]);
      } else {
        this.currentEnemy.currentZone = this.currentEnemy.zones[
          this.currentEnemy.currentZone.number + 1
        ];
        this.currentEnemy.currentZone.generateShips(
          this.currentEnemy.shipsDesign
        );
        this.currentEnemy.currentZone.reload();
      }
    }
    //#endregion

    this.inBattle = false;
  }
  delete(enemy: Enemy) {
    this.allEnemy = this.allEnemy.filter(e => e !== enemy);
  }
  surrender() {
    this.currentEnemy = null;
  }

  getRequiredSearch(level: number): Decimal {
    return new Decimal(level * 100).times(Decimal.pow(1.1, level - 1));
  }
  /**
   * Start searching a new enemy
   */
  startSearching(level: number) {
    const searchJob = new SearchJob();
    searchJob.level = level;
    searchJob.total = this.getRequiredSearch(level);
    searchJob.generateNameDescription();
    this.searchJobs.push(searchJob);
  }
  /**
   * Add progress, return
   * @return unused progress
   */
  addProgress(progress: Decimal) {
    while (this.searchJobs.length > 0 && progress.gt(0)) {
      progress = this.searchJobs[0].addProgress(progress);
      if (this.searchJobs[0].done) this.searchJobs.shift();
    }
  }
  /**
   *  Get sum of ToDo progress
   */
  getTotalToDo(): Decimal {
    return this.searchJobs
      .map(s => s.total.minus(s.progress))
      .reduce((p, c) => p.plus(c.min(1)), new Decimal(0));
  }
  getTotalEnemy(): number {
    return this.allEnemy.length + this.searchJobs.length;
  }

  //#region Save and Load
  getSave(): any {
    const data: any = {};
    if (this.maxLevel > 1) data.l = this.maxLevel;
    if (!!this.currentEnemy) data.c = this.currentEnemy.getSave();
    if (this.allEnemy.length > 0) data.a = this.allEnemy.map(e => e.getSave());
    if (this.searchJobs.length > 0) {
      data.j = this.searchJobs.map(j => j.getSave());
    }

    return data;
  }
  load(data: any): boolean {
    if ("l" in data) this.maxLevel = data.l;
    if ("c" in data) this.currentEnemy = Enemy.fromData(data.c, true);
    if ("a" in data) {
      for (const enemyData of data.a) {
        this.allEnemy.push(Enemy.fromData(enemyData));
      }
    }
    if (
      this.currentEnemy &&
      (!this.currentEnemy.zones || this.currentEnemy.zones.length !== 100)
    ) {
      this.currentEnemy.generateZones();
    }
    if (this.currentEnemy && this.currentEnemy.zones) {
      for (let i = 0; i < this.currentEnemy.currentZone.number; i++) {
        this.currentEnemy.zones[i].completed = true;
        this.currentEnemy.zones[i].reload();
      }
    }
    if ("j" in data) {
      for (const jobData of data.j) {
        if (jobData) {
          const job = SearchJob.FromData(jobData);
          this.searchJobs.push(job);
        }
      }
    }
    return true;
  }
  //#endregion
}

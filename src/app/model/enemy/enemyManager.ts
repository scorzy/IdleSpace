import { Enemy } from "./enemy";
import { ISalvable } from "../base/ISalvable";
import { BattleService } from "src/app/battle.service";
import { FleetManager } from "../fleet/fleetManager";
import { BattleRequest } from "src/app/workers/battleRequest";
import { Reward } from "./reward";
import { ResourceManager } from "../resource/resourceManager";
import { Emitters } from "src/app/emitters";

export class EnemyManager implements ISalvable {
  private static instance: EnemyManager;
  currentEnemy: Enemy;
  allEnemy = new Array<Enemy>();
  maxLevel = 1;
  battleService: BattleService;
  inBattle = false;

  currentSearch = new Decimal(0);
  totalSearch = new Decimal(0);
  requestedLevel = 1;
  isSearching = false;

  static GetInstance(): EnemyManager {
    return EnemyManager.instance;
  }
  constructor() {
    EnemyManager.instance = this;
  }
  generate(level = 1) {
    this.allEnemy.push(Enemy.generate(level));
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
  /**
   * Start searching a new enemy
   */
  startSearching(level: number) {
    if (this.isSearching) return false;
    this.isSearching = true;
    this.isSearching = true;
    this.currentSearch = new Decimal(0);
    this.totalSearch = new Decimal(level).times(Decimal.pow(1.1, level));
  }
  /**
   * Add progress, return
   * @return unused progress
   */
  addProgress(progress: Decimal): Decimal {
    this.currentSearch = this.currentSearch.plus(progress);
    if (this.currentSearch.gte(this.totalSearch)) {
      const ret = new Decimal(this.currentSearch.minus(this.totalSearch));
      this.stopSearching();
      this.generate(this.requestedLevel);
      return ret;
    } else {
      return new Decimal(0);
    }
  }
  /**
   * Stop Searching
   */
  stopSearching() {
    this.isSearching = false;

    //  not really needed, but why not?
    this.currentSearch = new Decimal(0);
    this.totalSearch = new Decimal(0);
    this.requestedLevel = 1;
  }
  /**
   *  Get sum of ToDo progress
   */
  getTotalToDo(): Decimal {
    return this.isSearching
      ? this.totalSearch.minus(this.currentSearch).max(1)
      : new Decimal(0);
  }

  //#region Save and Load
  getSave(): any {
    const data: any = {};
    if (this.maxLevel > 1) data.l = this.maxLevel;
    if (!!this.currentEnemy) data.c = this.currentEnemy.getSave();
    if (this.allEnemy.length > 0) data.a = this.allEnemy.map(e => e.getSave());

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
    return true;
  }
  //#endregion
}

import { Injectable } from "@angular/core";
import { createWorker, ITypedWorker } from "typed-web-workers";
import { getUrl } from "./main.service";
import { EnemyManager } from "./model/enemy/enemyManager";
import { BattleRequest, ShipData } from "./workers/battleRequest";
import { Emitters } from "./emitters";
import { Enemy } from "./model/enemy/enemy";
declare let MyFromDecimal: (arg: any) => Decimal;

@Injectable({
  providedIn: "root"
})
export class BattleService {
  private static instance: BattleService;
  battleWorker: ITypedWorker<BattleRequest, BattleResult>;
  em: Emitters;
  enemy: Enemy;

  constructor() {
    BattleService.instance = this;
    const url = getUrl();
    this.battleWorker = createWorker({
      workerFunction: this.doBattle,
      onMessage: this.onBattleEnd.bind(this),
      onError: error => {},
      importScripts: [
        url + "break_infinity.min.js",
        url + "assets/is.js"
        // url + "assets/ship.js",
        // url + "assets/battleResult.js",
        // url + "assets/myUtility.js"
      ]
    });
  }
  static getInstance(): BattleService {
    return BattleService.instance;
  }
  doBattle(input: BattleRequest, cb: (_: BattleResult) => void): void {
    // console.log(input);
    const initial = Date.now();
    let playerShips = new Array<Ship>();
    let enemyShip = new Array<Ship>();

    //#region Initialize Fleets
    const fleets: Array<[Ship[], ShipData[]]> = [
      [enemyShip, input.enemyFleet],
      [playerShips, input.playerFleet]
    ];
    fleets.forEach(toMake => {
      const ships = toMake[0];
      const design = toMake[1];
      design.forEach(ds => {
        const ship = new Ship();
        ship.id = ds.id;
        ship.class = ds.class;
        ship.isDefense = ds.isDefense;
        ship.armor = MyFromDecimal(ds.totalArmor);
        ship.originalArmor = MyFromDecimal(ship.armor);
        ship.shield = MyFromDecimal(ds.totalShield);
        ship.originalShield = MyFromDecimal(ship.shield);
        ship.explosionLevel = ds.explosionLevel / 100;
        ship.armorReduction = MyFromDecimal(ds.armorReduction);
        ship.shieldReduction = MyFromDecimal(ds.shieldReduction);
        ship.shieldCharger = MyFromDecimal(ds.shieldCharger);
        ds.modules.forEach(dl => {
          if (MyFromDecimal(dl.computedDamage).gt(0)) {
            ship.modules.push({
              damage: MyFromDecimal(dl.computedDamage),
              shieldPercent: dl.shieldPercent,
              armorPercent: dl.armorPercent
            });
          }
        });
        const qta = MyFromDecimal(ds.quantity).toNumber();
        for (let num = 0; num < qta; num++) {
          ships.push(ship.getCopy());
        }
      });
    });
    // console.log("player ships: " + playerShips.length);
    // console.log("enemy ships: " + enemyShip.length);

    //#endregion
    //#region Battle
    //  Up to 5 rounds
    const battleFleets = [playerShips, enemyShip];
    //  for each round
    for (let round = 0; round < 5; round++) {
      //  for both player and enemy fleets
      for (let num = 0; num < 2; num++) {
        const ships = battleFleets[num];
        const targets = battleFleets[(num + 1) % 2];
        if (targets.length < 1 || ships.length < 1) break;
        let defenders = targets.filter(s => s.class === "3");
        // console.log(defenders.length);
        let n = 0;
        for (const ship of ships) {
          n++;

          let availableTargets = targets;

          //  80% chance of hitting a defender
          if (
            ship.class !== "2" &&
            defenders.length > 0 &&
            Math.random() < 0.8
          ) {
            availableTargets = defenders;
          }

          switch (ship.class) {
            case "1": // Fighter
              availableTargets = availableTargets.filter(t => t.armor.gt(0));
              if (availableTargets.length === 0) availableTargets = targets;
              break;
            case "2": // Bomber
              availableTargets = targets.filter(
                t => t.isDefense && t.armor.gt(0)
              );
              break;
          }

          ship.modules.forEach(weapon => {
            const target =
              availableTargets[Math.floor(Math.random() * availableTargets.length)];
            if (target) {
              let damageToDo = weapon.damage;
              //  Damage to shield
              if (target.shield.gt(0)) {
                const shieldPercent = weapon.shieldPercent / 100;
                let maxShieldDamage = damageToDo.times(shieldPercent);
                maxShieldDamage = maxShieldDamage
                  .minus(target.shieldReduction)
                  .max(0);
                //  Skip if damage <0.1% shield
                if (maxShieldDamage.gte(target.shield.div(1000))) {
                  target.shield = target.shield.minus(maxShieldDamage);
                  // tslint:disable-next-line:prefer-conditional-expression
                  if (target.shield.lt(0)) {
                    damageToDo = Decimal.abs(
                      target.shield.minus(target.shieldReduction)
                    ).div(shieldPercent);
                    // console.log(damageToDo.toNumber());
                  } else {
                    damageToDo = new Decimal(0);
                  }
                } else {
                  damageToDo = new Decimal(0);
                }
              }
              //  Damage to Armor
              if (damageToDo.gt(0)) {
                let maxArmorDamage = damageToDo.times(weapon.armorPercent / 100);
                maxArmorDamage = maxArmorDamage
                  .minus(target.armorReduction)
                  .max(0);
                //  Skip if damage < 0.1% armor
                if (maxArmorDamage.gte(target.armor.div(1000))) {
                  target.armor = target.armor.minus(maxArmorDamage);
                  //  Check explosion
                  // console.log(
                  //   target.armor.div(target.originalArmor).toNumber() +
                  //     " - " +
                  //     target.explosionLevel
                  // );
                  if (
                    target.armor.gt(0) &&
                    target.armor.div(target.originalArmor).toNumber() <
                      target.explosionLevel
                  ) {
                    const prob =
                      1 -
                      target.armor
                        .div(target.originalArmor.times(target.explosionLevel))
                        .toNumber();
                    // console.log(
                    //   "Expl:" +
                    //     target.armor.toNumber() +
                    //     " " +
                    //     target.originalArmor.toNumber() +
                    //     " " +
                    //     target.explosionLevel +
                    //     " " +
                    //     prob
                    // );
                    if (Math.random() < prob) {
                      //  Explode
                      target.armor = new Decimal(-1);
                    }
                  }
                }
              }
              //  Remove defenders
              if (target.armor.lt(0)) {
                defenders = defenders.filter(d => d.armor.gt(0));
              }
            }
          });

          if (n % 10 === 0 && targets.findIndex(t => t.armor.gt(0)) < 0) {
            // console.log("break");
            break;
          }
        }
      }
      //  Remove death ships
      for (let num = 0; num < 2; num++) {
        const ships = battleFleets[num];
        const aliveShips = new Array<Ship>();
        for (const ship of ships) {
          if (ship.armor.gt(0)) {
            aliveShips.push(ship);
          } else {
            ship.free();
          }
        }
        battleFleets[num] = aliveShips;
      }

      //  Recharge shields
      for (let num = 0; num < 2; num++) {
        const ships = battleFleets[num];
        let totalCharge = ships
          .map(s => s.shieldCharger)
          .reduce((p, c) => p.plus(c), new Decimal(0));
        const sorted = ships
          .filter(s => s.shield.gt(0))
          .sort((a, b) =>
            a.shield.div(a.originalShield).cmp(b.shield.div(b.originalShield))
          );
        // console.log("total charge: " + totalCharge.toNumber());
        if (totalCharge.gt(0)) {
          for (const ship of sorted) {
            const missing = ship.originalShield
              .minus(ship.shield)
              .min(totalCharge);
            ship.shield = ship.shield.plus(missing);
            totalCharge = totalCharge.minus(missing);
            // console.log(totalCharge.toNumber());
            if (totalCharge.lte(0)) break;
            // console.log("charged: " + missing.toNumber());
          }
        }
      }

      [playerShips, enemyShip] = battleFleets; // Update ships variable to new array

      //  Regenerate shields
      // playerShips
      //   .concat(enemyShip)
      //   .filter(s => s.shield.gt(0))
      //   .forEach(s => {
      //     s.shield = new Decimal(s.originalShield);
      //   });

      if (playerShips.length === 0 || enemyShip.length === 0) break;
    }
    //#endregion
    //#region Return
    const ret = new BattleResult();
    if (enemyShip.length < 1) ret.result = "1";
    const retArr: Array<[ShipData[], Ship[], Array<[string, Decimal]>]> = [
      [input.playerFleet, playerShips, ret.playerLost],
      [input.enemyFleet, enemyShip, ret.enemyLost]
    ];

    retArr.forEach(arr => {
      const fleetCount = {};

      // Count and free the ships object
      for (const ship of arr[1]) {
        fleetCount[ship.id] = fleetCount[ship.id] ? fleetCount[ship.id] + 1 : 1;
        ship.free();
      }

      arr[0].forEach(fl => {
        const alive = fleetCount[fl.id];
        const qta = MyFromDecimal(fl.quantity);
        if (qta.gt(alive)) {
          arr[2].push([fl.id, qta.minus(alive)]);
        }
      });
    });

    const diff = Math.max(input.minTime * 1000 - Date.now() + initial, 5);
    if (diff > 0) {
      // console.log("wait:" + diff);
      setTimeout(() => cb(ret), diff);
    } else {
      cb(ret);
    }
    //#endregion
  }
  onBattleEnd(result: BattleResult): void {
    EnemyManager.getInstance().onBattleEnd(result);
    if (this.em) {
      this.em.updateEmitter.emit(2);
      this.em.battleEndEmitter.emit(1);
    }
  }
}

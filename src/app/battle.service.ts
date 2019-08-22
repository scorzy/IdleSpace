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
    const playerShips = new Array<Ship>();
    const enemyShip = new Array<Ship>();

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
          const copy = ship.getCopy();
          copy.fleetIndex = ships.push(copy) - 1;
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
    //   Ships are assumed to all attack at the same time
    for (let round = 0; round < 5; round++) {
      //  for both player and enemy fleets
      for (let num = 0; num < 2; num++) {
        const ships = battleFleets[num];
        const targets = battleFleets[(num + 1) % 2];

        // Create a copy of targets so it's simpler to implement
        const all = [];
        const defenders = [];
        const ground = [];

        for (const target of targets) {
          all.push(target);
          if (target.class === "3") {
            defenders.push(target);
          }

          if (target.isDefense) {
            ground.push(target);
          }
        }

        // console.log(defenders.length);
        for (const ship of ships) {
          let availableTargets = all;

          // Bomber can only hit grounded target
          if (ship.class === "2") {
            // skip early if there no ground unit
            if (ground.length === 0) continue;
            availableTargets = ground;
          } else if (
            //  80% chance of hitting a defender
            defenders.length > 0 &&
            Math.random() < 0.8
          ) {
            availableTargets = defenders;
          }

          if (availableTargets.length === 0) continue;

          for (const weapon of ship.modules) {
            const target =
              availableTargets[
                Math.floor(Math.random() * availableTargets.length)
              ];

            // targeted dead ship, consider attack as missed
            if (target.armor.lt(0)) continue;

            let damageToDo = weapon.damage;
            //  Damage to shield
            if (target.shield.gt(0)) {
              const shieldPercent = weapon.shieldPercent / 100;
              const maxShieldDamage = damageToDo
                .times(shieldPercent)
                .minus(target.shieldReduction)
                .max(0);

              //  Skip if damage <0.1% shield
              if (maxShieldDamage.lt(target.shield.div(1000))) continue;

              target.shield = target.shield.minus(maxShieldDamage);

              if (target.shield.gte(0)) continue;

              damageToDo = target.shield
                .minus(target.shieldReduction)
                .abs()
                .div(shieldPercent);
              // console.log(damageToDo.toNumber());
            }
            //  Damage to Armor
            if (damageToDo.gt(0)) {
              const maxArmorDamage = damageToDo
                .times(weapon.armorPercent / 100)
                .minus(target.armorReduction)
                .max(0);

              //  Skip if damage < 0.1% armor
              if (maxArmorDamage.lt(target.armor.div(1000))) continue;

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
                  target.armor.fromNumber(-1);
                }
              }

              //  Remove dead ship
              if (target.armor.lt(0)) {
                target.free();

                const last_target = targets.pop();
                // Modify target array inplace without shifting every item (optimization)
                if (target !== last_target) {
                  // Take the last target in array and put it where the target was.
                  last_target.fleetIndex = target.fleetIndex;
                  targets[target.fleetIndex] = last_target;
                }
              }
            }
          }

          // If all target are dead, skip the rest of the ships in fleet.
          if (targets.length === 0) {
            // console.log("break");
            break;
          }
        }
      }

      // If one of the fleet is dead
      if (battleFleets[0].length < 1 || battleFleets[1].length < 1) break;

      //  Recharge shields
      for (const ships of battleFleets) {
        let totalCharge = ships.reduce(
          (p, s) => p.plus(s.shieldCharger),
          new Decimal(0)
        );
        // console.log("total charge: " + totalCharge.toNumber());
        if (totalCharge.gt(0)) {
          const sorted = ships
            .filter(s => s.shield.gt(0))
            .sort((a, b) =>
              a.shield.div(a.originalShield).cmp(b.shield.div(b.originalShield))
            );

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

      //  Regenerate shields
      // playerShips
      //   .concat(enemyShip)
      //   .filter(s => s.shield.gt(0))
      //   .forEach(s => {
      //     s.shield = new Decimal(s.originalShield);
      //   });
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

      arr[0].forEach(fl => {
        fleetCount[fl.id] = 0;
      });

      // Count and free the ships object
      for (const ship of arr[1]) {
        fleetCount[ship.id] += 1;
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

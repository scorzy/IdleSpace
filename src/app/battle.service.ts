import { Injectable } from "@angular/core";
import { createWorker, ITypedWorker } from "typed-web-workers";
import { getUrl } from "./main.service";
import { BattleRequest } from "./workers/battleRequest";
import { BattleResult } from "./workers/battleResult";

@Injectable({
  providedIn: "root"
})
export class BattleService {
  battleWorker: ITypedWorker<BattleRequest, BattleResult>;

  constructor() {
    const url = getUrl();
    this.battleWorker = createWorker({
      workerFunction: this.doBattle,
      onMessage: this.onBattleEnd.bind(this),
      onError: error => {},
      importScripts: [url + "break_infinity.min.js"]
    });
  }
  doBattle(input: BattleRequest, cb: (_: BattleResult) => void): void {
    const playerShips = new Array<Ship>();
    const enemyShip = new Array<Ship>();
  }
  onBattleEnd(result: BattleRequest): void {}
}

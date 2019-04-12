import { Resource } from "../resource/resource";
import { ISalvable } from "../base/ISalvable";
import { Action } from "../actions/abstractAction";
import { MultiPrice } from "../prices/multiPrice";
import { Price } from "../prices/price";
import { Game } from "../game";

export class DarkMatterManager implements ISalvable {
  private static instance: DarkMatterManager;
  darkMatter: Resource;
  warpMin: Action;
  warpHour: Action;
  actions: Action[];

  static getInstance() {
    return DarkMatterManager.instance;
  }
  constructor(public game: Game) {
    DarkMatterManager.instance = this;
    this.darkMatter = new Resource("da");
    this.darkMatter.shape = "darkMatter";

    this.warpMin = new Action(
      "wi",
      new MultiPrice([new Price(this.darkMatter, 60, 1)])
    );
    this.warpMin.name = "Minute Warp (hotkey m)";
    this.warpMin.afterBuy = (number: Decimal) => {
      this.game.update(number.times(60).toNumber(), true);
    };

    this.warpHour = new Action(
      "wh",
      new MultiPrice([new Price(this.darkMatter, 3600, 1)])
    );
    this.warpHour.name = "Hour Warp (hotkey h)";
    this.warpHour.afterBuy = (number: Decimal) => {
      this.game.update(number.times(3600).toNumber(), true);
    };

    this.actions = [this.warpMin, this.warpHour];
    this.actions.forEach(a => {
      a.showNum = false;
      a.showTime = false;
    });
  }
  reload() {
    this.actions.forEach(a => a.reload());
  }
  //#region Save and Load
  getSave(): any {
    const save: any = {};
    save.d = this.darkMatter.getSave();
    return save;
  }
  load(data: any): boolean {
    if ("d" in data) this.darkMatter.load(data.d);
    return true;
  }
  //#endregion
}

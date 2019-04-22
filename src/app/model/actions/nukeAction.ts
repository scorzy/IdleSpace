import { Action } from "./abstractAction";
import { MultiPrice } from "../prices/multiPrice";
import { Price } from "../prices/price";
import { ResourceManager } from "../resource/resourceManager";
import { EnemyManager } from "../enemy/enemyManager";

export class NukeAction extends Action {
  totalNuke = new Decimal(0);
  nukeAll = false;
  constructor() {
    super(
      "N",
      new MultiPrice([new Price(ResourceManager.getInstance().missile, 1, 1)])
    );
    this.name = "Nuke";
    this.showTime = false;
  }
  onBuy(number: Decimal): boolean {
    EnemyManager.getInstance().nuke(number);
    return true;
  }
  reload() {
    const max = EnemyManager.getInstance().getMaxNuke();
    this.totalNuke = max;
    if (this.numWanted.gt(max)) this.numWanted = max;
    super.reload();
    this.maxBuy = this.maxBuy.min(max);
    this.nukeAll = this.maxBuy.gte(max);
    return;
  }
}

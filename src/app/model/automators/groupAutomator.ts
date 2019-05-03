import { Automator } from "./automator";
import { Resource } from "../resource/resource";
import { ResourceGroup } from "../resource/resourceGroup";
import { MultiBuyAction } from "../actions/multiBuyAction";
import { Action } from "../actions/abstractAction";

export abstract class GroupAutomator extends Automator {
  units = new Array<Resource>();
  constructor(id: string, public resourceGroup: ResourceGroup) {
    super("h" + resourceGroup.id + id);
  }
  execCondition(): boolean {
    return (
      this.units.findIndex(u => !u.unlocked) === -1 &&
      this.units.findIndex(u => u.isCapped) === -1
    );
  }
  assignToResource() {
    this.resourceGroup.automators.push(this);
  }
  abstract getAction(resource: Resource): Action;

  doAction(): boolean {
    const list = this.units.filter(u => u.unlocked);
    if (list.length < 1) return false;
    const multiBuy = new MultiBuyAction(list.map(r => this.getAction(r)));
    if (
      multiBuy.multiPrice
        .getMaxBuy(new Decimal(0), this.resourcePercentToUse)
        .gte(1)
    ) {
      return multiBuy.buy(new Decimal(1));
    }
    return false;
  }

  getSave(): any {
    const data: any = super.getSave();
    if (this.units.length > 0) data.u = this.units.map(u => u.id);

    return data;
  }
  load(data: any): boolean {
    if (!super.load(data)) return false;
    if ("u" in data) {
      for (const unitId of data.u) {
        const res = this.resourceGroup.resources.find(u => u.id === unitId);
        if (res) {
          this.units.push(res);
        }
      }
    }
    return true;
  }
}

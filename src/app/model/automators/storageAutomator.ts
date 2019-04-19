import { Automator } from "./automator";
import { Resource } from "../resource/resource";

export class StorageAutomator extends Automator {
  constructor(public material: Resource) {
    super(material.id + "A");
    this.name = "Storage Automator";
    this.description = "Buy Storage expansion automatically";
  }
  execCondition(): boolean {
    return this.material.isCapped;
  }
  doAction(): boolean {
    return this.material.actions[0].buy(new Decimal(1));
  }
  assignToResource() {
    this.material.automators.push(this);
  }
}

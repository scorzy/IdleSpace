import { Resource } from "../resource/resource";
import { Automator } from "./automator";

export class StorageAutomator extends Automator {
  constructor(public material: Resource) {
    super(material.id + "A");
    this.name = "Storage Automation";
    this.resource = material;
  }
  execCondition(): boolean {
    return this.material.isCapped;
  }
  doAction(): boolean {
    return this.material.actions[0].buy(new Decimal(1));
  }
}

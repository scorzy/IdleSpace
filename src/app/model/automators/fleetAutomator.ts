import { Automator } from "./automator";
import { FleetManager } from "../fleet/fleetManager";

export class FleetAutomator extends Automator {
  constructor() {
    super("fla");
    this.name = "Auto Fleet Upgrade";
    this.description = "Automatically maximize ships modules";
    this.stopWhenFactoryUi = false;
    this.description = "Auto Fleet Upgrade";
    this.prestigeLevel = 16;
    this.showResourceUsage = false;
  }
  doAction(): boolean {
    const fleetMan = FleetManager.getInstance();
    if (fleetMan.isUsed) return false;
    let done = false;
    fleetMan.ships
      .filter(s => !s.isUpgrading)
      .forEach(s => {
        if (!done) {
          s.copy();

          if (s.maxAll() && s.isValid) {
            s.saveConfig();
            done = true;
          }
        }
      });
    return done;
  }
}

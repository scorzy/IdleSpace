import { IUnlockable } from "../base/IUnlockable";

export class ShipClass implements IUnlockable {
  constructor(
    public id: string,
    public name: string,
    public description: string
  ) {}

  unlocked = false;
  unlock(): boolean {
    this.unlocked = true;
    return true;
  }
}
export const Classes: ShipClass[] = [
  new ShipClass("1", "Fighter", "Fighter +50% damage, target alive ships"),
  new ShipClass("2", "Bomber", "Bomber +100% damage"),
  new ShipClass(
    "3",
    "Defender",
    "Defender +50% armor and shield, draws 80% of enemy fire"
  ),
  new ShipClass("4", "Technician", "Technician"),
  new ShipClass("5", "Supply", "Supply")
];

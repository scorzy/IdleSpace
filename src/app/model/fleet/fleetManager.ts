import { ISalvable } from "../base/ISalvable";
import { ShipDesign } from "./shipDesign";
import { ShipType } from "./shipTypes";
import { Weapon } from "./weapon";

export class FleetManager implements ISalvable {
  totalNavalCapacity = new Decimal(20);
  ships = new Array<ShipDesign>();

  allWeapons = new Array<Weapon>();
  unlockedWeapons = new Array<Weapon>();

  //#region Weapons
  laserS: Weapon;
  laserM: Weapon;
  laserL: Weapon;
  laserXL: Weapon;
  //#endregion

  constructor() {
    this.laserS = new Weapon("ls");
    this.laserM = new Weapon("lm");
    this.laserL = new Weapon("ll");
    this.laserXL = new Weapon("lxl");

    this.laserS.damage = new Decimal(50);

    this.allWeapons = [this.laserS, this.laserM, this.laserL, this.laserXL];

    this.allWeapons.forEach(w => (w.unlocked = true));
    this.reload();
  }

  reload() {
    this.unlockedWeapons = this.allWeapons.filter(w => w.unlocked);
  }
  addDesign(name: string, type: ShipType): ShipDesign {
    const design = new ShipDesign();

    design.id =
      "" +
      (this.ships
        .map(s => parseInt(s.id, 10))
        .reduce((p, c) => Math.max(p, c), 0) +
        1);
    design.name = name;
    design.type = type;

    this.ships.push(design);
    return design;
  }

  getSave() {}
  load(data: any): boolean {
    this.reload();
    return true;
  }
}

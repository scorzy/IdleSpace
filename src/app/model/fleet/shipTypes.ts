import { BASE_ARMOR } from "./moduleData";
import { RomanPipe } from "src/app/roman.pipe";

export class ShipType {
  constructor(
    public id: string,
    public name: string,
    public baseCost: Decimal,
    public health: Decimal,
    public moduleCount: number,
    public modulePoint: number,
    public shape: string,
    public navalCapacity: number,
    public enemyNavalCapacity: number = navalCapacity,
    public defense = false
  ) {}

  static GetTitan(i = 0): ShipType {
    const k = i + 7;
    return new ShipType(
      "" + k,
      "Titan " + new RomanPipe().transform(i + 1),
      new Decimal(10).times(Decimal.pow(2, k)),
      new Decimal(BASE_ARMOR * 1.25 * k),
      10,
      (1 + k) * 2,
      "rank4",
      Math.floor(10 * Math.pow(1.5, k - 1)) / 10,
      Math.floor(10 * Math.pow(1.5, k - 1)) / 10
    );
  }
}
export const ShipTypes = [
  new ShipType(
    "1",
    "Corvette",
    new Decimal(10),
    new Decimal(BASE_ARMOR),
    4,
    4,
    "rank1",
    1,
    1
  ),
  new ShipType(
    "2",
    "Frigate",
    new Decimal(20),
    new Decimal(BASE_ARMOR * 2.25),
    5,
    6,
    "rank2",
    1.5,
    1.8
  ),
  new ShipType(
    "3",
    "Destroyer",
    new Decimal(40),
    new Decimal(BASE_ARMOR * 3.5),
    6,
    8,
    "rank3",
    2.25,
    3.24
  ),
  new ShipType(
    "4",
    "Cruiser",
    new Decimal(80),
    new Decimal(BASE_ARMOR * 4.75),
    7,
    10,
    "rank4",
    3.7,
    5.9
  ),
  new ShipType(
    "5",
    "Battlecruiser",
    new Decimal(160),
    new Decimal(BASE_ARMOR * 6),
    8,
    12,
    "rank4",
    5,
    11
  ),
  new ShipType(
    "6",
    "Battleship",
    new Decimal(320),
    new Decimal(BASE_ARMOR * 7.25),
    9,
    14,
    "rank4",
    7.5,
    20
  )
];

export const DefenseTypes = [
  new ShipType(
    "D1",
    "Small",
    new Decimal(10),
    new Decimal(BASE_ARMOR),
    4,
    4,
    "rank1",
    2,
    2,
    true
  ),
  new ShipType(
    "D3",
    "Medium",
    new Decimal(40),
    new Decimal(BASE_ARMOR * 3.5),
    6,
    8,
    "rank3",
    6,
    6,
    true
  ),
  new ShipType(
    "D5",
    "Large",
    new Decimal(160),
    new Decimal(BASE_ARMOR * 6),
    8,
    12,
    "rank4",
    24,
    24,
    true
  ),
  new ShipType(
    "D7",
    "Extra Large",
    new Decimal(640),
    new Decimal(BASE_ARMOR * 8.5),
    10,
    16,
    "rank4",
    80,
    80,
    true
  )
];

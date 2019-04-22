import { BASE_ARMOR } from "./moduleData";

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
    public defense = false
  ) {}
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
    2
  ),
  new ShipType(
    "3",
    "Destroyer",
    new Decimal(40),
    new Decimal(BASE_ARMOR * 3.5),
    6,
    8,
    "rank3",
    4
  ),
  new ShipType(
    "4",
    "Cruiser",
    new Decimal(80),
    new Decimal(BASE_ARMOR * 4.75),
    7,
    10,
    "rank4",
    8
  ),
  new ShipType(
    "5",
    "Battlecruiser",
    new Decimal(160),
    new Decimal(BASE_ARMOR * 6),
    8,
    12,
    "rank4",
    16
  ),
  new ShipType(
    "6",
    "Battleship",
    new Decimal(320),
    new Decimal(BASE_ARMOR * 7.25),
    9,
    14,
    "rank4",
    32
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
    1,
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
    4,
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
    16,
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
    64,
    true
  )
];

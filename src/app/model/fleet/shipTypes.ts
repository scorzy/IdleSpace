export class ShipType {
  constructor(
    public id: string,
    public name: string,
    public baseCost: Decimal,
    public health: Decimal,
    public modulePoint: number,
    public moduleCount: number,
    public shape: string,
    public navalCapacity: number
  ) {}
}
export const ShipTypes = [
  new ShipType(
    "1",
    "Corvette",
    new Decimal(50),
    new Decimal(50),
    4,
    4,
    "rank1",
    1
  ),
  new ShipType(
    "2",
    "Frigate",
    new Decimal(100),
    new Decimal(100),
    6,
    8,
    "rank2",
    2
  ),
  new ShipType(
    "3",
    "Destroyer",
    new Decimal(200),
    new Decimal(200),
    8,
    16,
    "rank3",
    4
  ),
  new ShipType(
    "4",
    "Cruiser",
    new Decimal(400),
    new Decimal(400),
    10,
    32,
    "rank4",
    8
  ),
  new ShipType(
    "5",
    "Battlecruiser",
    new Decimal(800),
    new Decimal(800),
    12,
    64,
    "rank4",
    16
  ),
  new ShipType(
    "6",
    "Battleship",
    new Decimal(1600),
    new Decimal(1600),
    32,
    128,
    "rank4",
    32
  )
];

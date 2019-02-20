export class ShipType {
  constructor(
    public id: string,
    public name: string,
    public baseCost: Decimal,
    public health: Decimal,
    public weaponPoint: number,
    public weaponCount: number,
    public utility: number
  ) {}
}
export const ShipTypes = [
  new ShipType("1", "Corvette", new Decimal(50), new Decimal(50), 1, 1, 2),
  new ShipType("2", "Frigate", new Decimal(100), new Decimal(100), 2, 2, 4),
  new ShipType("3", "Destroyer", new Decimal(200), new Decimal(200), 4, 3, 8),
  new ShipType("4", "Cruiser", new Decimal(400), new Decimal(400), 8, 4, 16),
  new ShipType(
    "5",
    "Battlecruiser",
    new Decimal(800),
    new Decimal(800),
    16,
    5,
    32
  ),
  new ShipType(
    "6",
    "Battleship",
    new Decimal(1600),
    new Decimal(1600),
    32,
    6,
    64
  )
];

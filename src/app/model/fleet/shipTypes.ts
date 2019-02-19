export class ShipType {
  constructor(
    public name: string,
    public baseCost: Decimal,
    public health: Decimal,
    public weaponPoint: number,
    public weaponCount: number,
    public utility: number
  ) {}
}
export const ShipTypes = [
  new ShipType("Corvette", new Decimal(50), new Decimal(50), 1, 1, 2),
  new ShipType("Frigate", new Decimal(100), new Decimal(100), 2, 2, 4),
  new ShipType("Destroyer", new Decimal(200), new Decimal(200), 4, 3, 8),
  new ShipType("Cruiser", new Decimal(400), new Decimal(400), 8, 4, 16),
  new ShipType("Battlecruiser", new Decimal(800), new Decimal(800), 16, 5, 32),
  new ShipType("Battleship", new Decimal(1600), new Decimal(1600), 32, 6, 64)
];

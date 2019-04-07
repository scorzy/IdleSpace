export class SkillEffect {
  private static lastId = 0;
  id: number;
  shape: string;
  numOwned = 0;
  label = "";

  shapeNotAvailable: string;
  shapeOwned: string;
  shapeAvailable: string;

  constructor() {
    this.id = SkillEffect.lastId;
    SkillEffect.lastId++;
  }

  getDescription(num = 1): string {
    return "";
  }

  afterBuy() {}
}

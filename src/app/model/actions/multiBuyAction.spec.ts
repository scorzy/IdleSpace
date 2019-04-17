import { getGame } from "src/app/app.component.spec";
import { Game } from "../game";
import { MultiBuyAction } from "./multiBuyAction";

describe("MultiBuyAction", () => {
  let game: Game;
  beforeEach(() => {
    game = getGame();
  });
  it("should create an instance", () => {
    expect(new MultiBuyAction([])).toBeTruthy();
  });

  it("prices test", () => {
    const act1 = game.resourceManager.crystalX1.buyAction;
    const act2 = game.resourceManager.metalX1.buyAction;
    game.resourceManager.crystalX1.quantity = new Decimal(5);
    act1.quantity = new Decimal(5);
    const multiBuy = new MultiBuyAction([act1, act2]);
    act1.reload();
    act2.reload();
    multiBuy.reload();

    expect(
      act1.multiPrice.prices[0].singleCost
        .plus(act2.multiPrice.prices[0].singleCost)
        .toNumber()
    ).toBe(multiBuy.multiPrice.prices[0].singleCost.toNumber());
  });
});


import { ShipDesign } from "./shipDesign";
import { ShipTypes } from "./shipTypes";
import { Sizes } from "./module";

describe("ShipDesign", () => {
  it("default corvette", () => {
    const corvetteDesign = ShipDesign.fromPreset({
      name: "Corvette",
      type: ShipTypes[0],
      modules: [
        {
          id: ["l"],
          size: Sizes.Small
        },
        {
          id: ["S"],
          size: Sizes.Small
        },
        {
          id: ["a"],
          size: Sizes.Small
        }
      ]
    });
    expect(corvetteDesign.modules[0].module.id).toBe("l");
    expect(corvetteDesign.modules[1].module.id).toBe("S");
    expect(corvetteDesign.modules[2].module.id).toBe("a");
    expect(corvetteDesign.modules[2].size).toBe(2);
  });
  it("enemy corvette", () => {
    const corvetteDesign = ShipDesign.fromPreset({
      name: "Corvette",
      type: ShipTypes[0],
      modules: [
        {
          id: ["l"],
          size: Sizes.Small
        },
        {
          id: ["S"],
          size: Sizes.Small
        },
        {
          id: ["s"],
          size: Sizes.Small
        }
      ]
    });
    expect(corvetteDesign.modules[0].module.id).toBe("l");
    expect(corvetteDesign.modules[1].module.id).toBe("S");
    expect(corvetteDesign.modules[2].module.id).toBe("s");
    expect(corvetteDesign.modules[3].module.id).toBe("a");
  });
});

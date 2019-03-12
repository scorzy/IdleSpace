import { Presets } from "./preset";
import { ShipDesign } from "../fleet/shipDesign";

describe("Preset", () => {
  it("Presets should be valid", () => {
    Presets.forEach(pr => {
      const shipDesign = ShipDesign.fromPreset(pr);
      shipDesign.modules.forEach(m => expect(m).toBeDefined());
      shipDesign.reload();
      expect(shipDesign.isValid).toBeTruthy();
    });
  });
});

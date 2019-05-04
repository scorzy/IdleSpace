import { ShipDesign } from "../fleet/shipDesign";
import { Preset } from "./preset";

describe("Preset", () => {
  /**
   * This test include random stuff
   * So i will make it 10 time to test more cases :)
   */
  it("Presets should be valid", () => {
    for (let i = 0; i < 10; i++) {
      Preset.Presets.forEach(pr => {
        const shipDesign = ShipDesign.fromPreset(pr);
        shipDesign.modules.forEach(m => expect(m).toBeTruthy());

        shipDesign.reload();
        expect(shipDesign.isValid).toBeTruthy();
        if (!shipDesign.isValid) {
          console.log(shipDesign);
        }
      });
    }
  });
});

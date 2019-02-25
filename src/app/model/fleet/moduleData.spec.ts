import { ModulesData } from "./moduleData";

describe("ModulesData", () => {
  it("should have unique ids", () => {
    const ids = ModulesData.map(m => m.id);
    const unique = Array.from(new Set(ids));
    expect(ids.length).toBe(unique.length);
  });
});

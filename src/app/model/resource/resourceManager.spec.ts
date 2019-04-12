import { ResourceManager } from "./resourceManager";
import { Resource } from "./resource";

describe("ResourceManager", () => {
  let resourceManager: ResourceManager;
  beforeEach(() => {
    resourceManager = new ResourceManager();
  });
  it("Unique 1ds", () => {
    const ids = resourceManager.allResources.map(res => res.id);
    for (let i = 0; i < ids.length; i++) {
      expect(ids.indexOf(ids[i])).toBe(i);
    }
  });
  it("loadPolynomial", () => {
    const res1 = new Resource("m");
    const res2 = new Resource("c");
    const res3 = new Resource("e");
    const res4 = new Resource("f");

    res1.addGenerator(res2);
    res2.addGenerator(res3);
    res3.addGenerator(res4);

    resourceManager.unlockedProdResources = [res1, res2, res3, res4];
    resourceManager.unlockedProdResources.forEach(res => {
      res.quantity = new Decimal(1);
      res.operativity = 100;
      res.unlocked = true;
    });
    resourceManager.loadPolynomial();

    expect(res1.c.toNumber()).toBe(1);
    expect(res2.c.toNumber()).toBe(1);
    expect(res3.c.toNumber()).toBe(1);
    expect(res4.c.toNumber()).toBe(0);
  });
});

import { Resource } from "./resource";

describe("Resource", () => {
  let res1: Resource;
  let res2: Resource;
  let res3: Resource;

  beforeEach(() => {
    res1 = new Resource("m");
    res2 = new Resource("m");
    res3 = new Resource("e");
  });
  it("Save 1", () => {
    res1.quantity = new Decimal(10);
    res1.unlocked = true;
    const save = res1.getSave();
    const ret = res2.load(save);
    expect(ret).toBeTruthy();
    expect(res2.quantity.toNumber()).toBe(10);
    expect(res2.unlocked).toBeTruthy();
  });
  it("Save 1", () => {
    res1.quantity = new Decimal(10);
    res1.unlocked = true;
    const save = res1.getSave();
    const ret = res3.load(save);
    expect(ret).toBeFalsy();
    expect(res3.quantity.toNumber()).toBe(0);
    expect(res3.unlocked).toBeFalsy();
  });
});

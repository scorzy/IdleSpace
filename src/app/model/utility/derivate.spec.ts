import { derivate } from "./derivate";

describe("derivate", () => {
  it("constant", () => {
    const pol = [new Decimal(10)];
    const der = derivate(pol);
    expect(der.length).toBe(0);
  });
  it("x", () => {
    const pol = [new Decimal(10), new Decimal(2)];
    const der = derivate(pol);
    expect(der.length).toBe(1);
    expect(der[0].toNumber()).toBe(2);
  });
  it("x^3", () => {
    const pol = [
      new Decimal(1),
      new Decimal(2),
      new Decimal(5),
      new Decimal(7)
    ];
    const der = derivate(pol);
    expect(der.length).toBe(3);
    expect(der[0].toNumber()).toBe(2);
    expect(der[1].toNumber()).toBe(10);
    expect(der[2].toNumber()).toBe(21);
  });
});

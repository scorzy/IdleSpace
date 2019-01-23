/**
 *  Derivate a polynomial
 *
 * @param  polynomial polynomial[0] = c, polynomial[1]=x^1
 * @returns solutions, real roots only
 */
export function derivate(polynomial: Decimal[]): Decimal[] {
  const derivateSol = new Array<Decimal>();

  for (let i = 1; i < polynomial.length; i++) {
    derivateSol.push(polynomial[i].times(i));
  }
  return derivateSol;
}

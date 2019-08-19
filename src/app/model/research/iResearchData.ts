import { IUnlockable } from "../base/IUnlockable";
import { ShipType } from "../fleet/shipTypes";

export interface IResearchData {
  id: string;
  name: string;
  shape: string;
  description: string;
  price: number;
  resourceToUnlock?: string[];
  researchToUnlock?: string[];
  otherToUnlock?: [() => IUnlockable];
  limit?: number;
  navalCapacity?: number;
  ship?: ShipType;
  bonus?: Array<[string, string]>;
  classesToUnlock?: string[];
}

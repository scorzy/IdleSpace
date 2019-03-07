import { IUnlockable } from "../base/IUnlockable";

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
}

import { IResearchData } from "./iResearchData";
import { ResourceManager } from "../resource/resourceManager";

export const ResearchData: IResearchData[] = [
  {
    id: "a",
    name: "Alloy",
    shape: "alloy",
    price: 100,
    description: "Unlock alloy foundry",
    resourceToUnlock: ["a", "a1"],
    researchToUnlock: ["c"],
    otherToUnlock: [() => ResourceManager.getInstance().alloyFoundry]
  },
  {
    id: "r",
    name: "Better Researching",
    shape: "flask",
    price: 100,
    description: "+20% researching speed",
    limit: Number.POSITIVE_INFINITY
  },
  {
    id: "c",
    name: "Corvette",
    shape: "rank1",
    price: 100,
    description: "Unlock Corvette",
    researchToUnlock: ["f"]
  },
  {
    id: "f",
    name: "Frigate",
    shape: "rank2",
    price: 100,
    description: "Unlock frigate",
    researchToUnlock: ["d"]
  },
  {
    id: "d",
    name: "Destroyer",
    shape: "rank3",
    price: 100,
    description: "Unlock destroyer",
    researchToUnlock: ["b"]
  },
  {
    id: "b",
    name: "Cruiser",
    shape: "rank4",
    price: 100,
    description: "Unlock cruiser",
    researchToUnlock: ["t"]
  },
  {
    id: "t",
    name: "Battlecruiser",
    shape: "flask",
    price: 100,
    description: "Unlock battlecruiser",
    researchToUnlock: ["s"]
  },
  {
    id: "s",
    name: "Battleship",
    shape: "flask",
    price: 100,
    description: "Unlock battleship"
  },
  {
    id: "B",
    name: "Battery",
    shape: "battery",
    price: 100,
    description: "Unlock batteries"
  }
];

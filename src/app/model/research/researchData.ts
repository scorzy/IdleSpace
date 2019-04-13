import { IResearchData } from "./iResearchData";

export const ResearchData: IResearchData[] = [
  //  Unlocked by default
  {
    id: "r",
    name: "Better Researching",
    shape: "flask",
    price: 200,
    description: "+20% researching speed",
    limit: Number.POSITIVE_INFINITY,
    researchToUnlock: ["c"]
  },
  //    End of starting researches  ---------------
  {
    id: "c",
    name: "Corvette",
    shape: "rank1",
    price: 2e3,
    description: "Unlock Corvette",
    resourceToUnlock: ["S1", "SP", "a", "a1"],
    researchToUnlock: ["f", "X1", "W1"]
  },
  {
    id: "W1",
    name: "Warriors",
    shape: "bullseye",
    price: 1e4,
    description: "Unlock Warriors",
    resourceToUnlock: ["W1", "n"]
  },
  {
    id: "X1",
    name: "Telescope",
    shape: "radar",
    price: 1e5,
    description: "Unlock Telescope",
    resourceToUnlock: ["X1", "XP"],
    researchToUnlock: ["D"]
  },
  {
    id: "f",
    name: "Frigate",
    shape: "rank2",
    price: 1e4,
    description: "Unlock frigate",
    researchToUnlock: ["d"]
  },
  {
    id: "d",
    name: "Destroyer",
    shape: "rank3",
    price: 1e6,
    description: "Unlock destroyer",
    researchToUnlock: ["b"]
  },
  {
    id: "b",
    name: "Cruiser",
    shape: "rank4",
    price: 1e9,
    description: "Unlock cruiser",
    researchToUnlock: ["t"]
  },
  {
    id: "t",
    name: "Battlecruiser",
    shape: "flask",
    price: 1e13,
    description: "Unlock battlecruiser",
    researchToUnlock: ["s"]
  },
  {
    id: "s",
    name: "Battleship",
    shape: "flask",
    price: 1e18,
    description: "Unlock battleship"
  },
  // {
  //   id: "B",
  //   name: "Battery",
  //   shape: "battery",
  //   price: 1e3,
  //   description: "Unlock batteries; +100% max energy",
  //   limit: Number.POSITIVE_INFINITY
  // },
  {
    id: "D",
    name: "Drone Factory",
    shape: "battery",
    price: 1e5,
    description: "Drone Factory",
    resourceToUnlock: ["D", "F"],
    researchToUnlock: ["M"]
  },
  {
    id: "M",
    name: "Drone Modding",
    shape: "battery",
    price: 2e5,
    description: "+1 drone modding point",
    limit: Number.POSITIVE_INFINITY
  }
];

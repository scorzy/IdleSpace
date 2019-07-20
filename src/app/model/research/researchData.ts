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
    researchToUnlock: ["c", "E"],
    bonus: [["Research Speed", "+20%"]]
  },
  //    End of starting researches  ---------------
  {
    id: "E",
    name: "Energy",
    shape: "energy",
    price: 5e3,
    description: "+10% energy",
    limit: Number.POSITIVE_INFINITY,
    researchToUnlock: ["CO"],
    bonus: [["Energy Gain", "+10%"]]
  },
  {
    id: "CO",
    name: "Computing",
    shape: "cpu",
    price: 5e4,
    description: "+10% computing",
    limit: Number.POSITIVE_INFINITY,
    bonus: [["Computing Gain", "+10%"]]
  },
  {
    id: "c",
    name: "Corvette",
    shape: "rank1",
    price: 2e3,
    description: "Unlock Corvette",
    resourceToUnlock: ["S1", "SP", "a", "a1"],
    researchToUnlock: ["SC", "f", "X1", "W1", "mM", "cM", "eM"]
  },
  {
    id: "SC",
    name: "Scavenger",
    shape: "coin-bag",
    price: 5e3,
    description: "+10% resources from battle",
    limit: Number.POSITIVE_INFINITY,
    bonus: [["Resources from battle", "+10%"]]
  },
  {
    id: "W1",
    name: "Warriors",
    shape: "bullseye",
    price: 1e5,
    description: "Unlock Warriors",
    resourceToUnlock: ["W1", "n"]
  },
  {
    id: "X1",
    name: "Telescope",
    shape: "radar",
    price: 1e4,
    description: "Unlock Telescope",
    resourceToUnlock: ["X1", "XP"],
    researchToUnlock: ["M", "D"]
  },
  {
    id: "f",
    name: "Frigate",
    shape: "rank2",
    price: 1e6,
    description: "Unlock frigate",
    researchToUnlock: ["d"]
  },
  {
    id: "d",
    name: "Destroyer",
    shape: "rank3",
    price: 1e8,
    description: "Unlock destroyer",
    researchToUnlock: ["b"]
  },
  {
    id: "b",
    name: "Cruiser",
    shape: "rank4",
    price: 1e11,
    description: "Unlock cruiser",
    researchToUnlock: ["t"]
  },
  {
    id: "t",
    name: "Battlecruiser",
    shape: "flask",
    price: 1e14,
    description: "Unlock battlecruiser",
    researchToUnlock: ["civ", "s"]
  },
  {
    id: "s",
    name: "Battleship",
    shape: "flask",
    price: 1e17,
    description: "Unlock battleship",
    researchToUnlock: ["n"]
  },
  {
    id: "n",
    name: "Titan",
    shape: "titan",
    price: 1e20,
    description: "Unlock Titan",
    limit: 100
  },
  {
    id: "D",
    name: "Robot Factory",
    shape: "battery",
    price: 1e7,
    description: "Robot Factory",
    resourceToUnlock: ["D", "F"],
    researchToUnlock: ["i"]
  },
  {
    id: "M",
    name: "Drone Modding",
    shape: "battery",
    price: 2e5,
    description: "+1 drone modding point",
    limit: Number.POSITIVE_INFINITY,
    bonus: [["Modding Point", "+1"]]
  },
  {
    id: "i",
    name: "Missiles",
    shape: "missile",
    price: 1e7,
    description: "Anti Defense interplanetary missile",
    resourceToUnlock: ["i", "i1"],
    limit: Number.POSITIVE_INFINITY,
    bonus: [["Missile Damage", "+20%"]]
  },
  {
    id: "mM",
    name: "Mineral purification plant",
    shape: "metal",
    price: 5e4,
    description: "unlock Mineral purification plant",
    resourceToUnlock: ["mM"]
  },
  {
    id: "cM",
    name: "Crystal purification plant",
    shape: "crystal",
    price: 5e4,
    description: "unlock Crystal purification plant",
    resourceToUnlock: ["cM"]
  },
  {
    id: "eM",
    name: "Electrical grid",
    shape: "energy",
    price: 5e4,
    description: "unlock Electrical grid",
    resourceToUnlock: ["eM"]
  },
  {
    id: "civ",
    name: "Civilian Ships",
    shape: "satellite",
    price: 1e14,
    description: "Unlock civilian ships",
    resourceToUnlock: ["te", "sc", "ss", "bs"]
  }
];

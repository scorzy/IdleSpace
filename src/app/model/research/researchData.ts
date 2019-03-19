import { IResearchData } from "./iResearchData";

export const ResearchData: IResearchData[] = [
  //  First two research are unlocked by default
  //  Dont Move !
  {
    id: "a",
    name: "Alloy",
    shape: "alloy",
    price: 100,
    description: "Unlock alloy foundry",
    resourceToUnlock: ["a", "a1"],
    researchToUnlock: ["S1"]
  },
  {
    id: "r",
    name: "Better Researching",
    shape: "flask",
    price: 100,
    description: "+20% researching speed",
    limit: Number.POSITIVE_INFINITY,
    researchToUnlock: ["B"]
  },
  //    End of starting researches  ---------------
  {
    id: "S1",
    name: "Shipyard",
    shape: "alloy",
    price: 100,
    description: "Unlock Shipyard",
    resourceToUnlock: ["S1", "SP"],
    researchToUnlock: ["c", "m2"]
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
  },
  {
    id: "m2",
    name: "Mining Drone Factory",
    shape: "battery",
    price: 100,
    description: "Unlock Mining Drone factories",
    resourceToUnlock: ["m2"],
    researchToUnlock: ["c2"]
  },
  {
    id: "c2",
    name: "Crystal Drone Factory",
    shape: "battery",
    price: 100,
    description: "Unlock Mining Drone factories",
    resourceToUnlock: ["c2"],
    researchToUnlock: ["a2", "e2", "f2"]
  },
  {
    id: "a2",
    name: "Alloy Drone Factory",
    shape: "battery",
    price: 100,
    description: "Unlock Alloy Drone factories",
    researchToUnlock: ["S2"],
    resourceToUnlock: ["a2"]
  },
  {
    id: "S2",
    name: "Shipyard 2",
    shape: "battery",
    price: 100,
    description: "Unlock Alloy Drone factories",
    resourceToUnlock: ["S2"]
  },
  {
    id: "e2",
    name: "Technician Drone Factory",
    shape: "battery",
    price: 100,
    description: "Unlock Technician Drone factories",
    resourceToUnlock: ["e2"]
  },
  {
    id: "f2",
    name: "Super Computing Center",
    shape: "battery",
    price: 100,
    description: "Unlock Technician Drone factories",
    resourceToUnlock: ["f2"],
    researchToUnlock: ["m3"]
  },
  {
    id: "m3",
    name: "Mining 3",
    shape: "battery",
    price: 100,
    description: "Unlock Mining Drone factories",
    resourceToUnlock: ["m3"],
    researchToUnlock: ["c3"]
  },
  {
    id: "c3",
    name: "Crystal 3",
    shape: "battery",
    price: 100,
    description: "Unlock Mining Drone factories",
    resourceToUnlock: ["c3"],
    researchToUnlock: ["a3", "e3", "f3"]
  },
  {
    id: "a3",
    name: "Alloy 3",
    shape: "battery",
    price: 100,
    description: "Unlock Alloy Drone factories",
    researchToUnlock: ["S3"],
    resourceToUnlock: ["a3"]
  },
  {
    id: "S3",
    name: "Shipyard 3",
    shape: "battery",
    price: 100,
    description: "Unlock Alloy Drone factories",
    resourceToUnlock: ["S3"]
  },
  {
    id: "e3",
    name: "Technician 3",
    shape: "battery",
    price: 100,
    description: "Unlock Technician Drone factories",
    resourceToUnlock: ["e3"]
  },
  {
    id: "f3",
    name: "Super 3",
    shape: "battery",
    price: 100,
    description: "Unlock Technician Drone factories",
    resourceToUnlock: ["f3"]
  }
];

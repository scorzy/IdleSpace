import { ShipTypes, ShipType } from "../fleet/shipTypes";
import { Sizes } from "../fleet/module";

export class Preset {
  name: string;
  type: ShipType;
  modules: Array<{ id: string[]; size: Sizes }>;
}
const RANDOM_WEAPON = ["l", "p", "d", "g"];
const RANDOM_DEFENSE = ["a", "s"];
const RANDOM_GENERATOR = ["S", "R", "F"];

export const Presets: Preset[] = [
  {
    name: "Corvette",
    type: ShipTypes[0],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.Small
      },
      {
        id: RANDOM_GENERATOR,
        size: Sizes.Small
      },
      {
        id: RANDOM_DEFENSE,
        size: Sizes.Small
      }
    ]
  },
  {
    name: "Frigate A",
    type: ShipTypes[1],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.Small
      },
      {
        id: RANDOM_GENERATOR,
        size: Sizes.Small
      },
      {
        id: ["a"],
        size: Sizes.Small
      },
      {
        id: RANDOM_DEFENSE,
        size: Sizes.Small
      }
    ]
  },
  {
    name: "Frigate B",
    type: ShipTypes[1],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.Large
      },
      {
        id: ["F"],
        size: Sizes.Small
      },
      {
        id: ["a"],
        size: Sizes.Small
      },
      {
        id: RANDOM_DEFENSE,
        size: Sizes.Small
      }
    ]
  },
  {
    name: "Frigate C",
    type: ShipTypes[1],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.Medium
      },
      {
        id: RANDOM_WEAPON,
        size: Sizes.Small
      },
      {
        id: ["F"],
        size: Sizes.Small
      },
      {
        id: ["a"],
        size: Sizes.Small
      },
      {
        id: RANDOM_DEFENSE,
        size: Sizes.Small
      }
    ]
  },
  {
    name: "Frigate D",
    type: ShipTypes[1],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.Small
      },
      {
        id: ["F"],
        size: Sizes.Small
      },
      {
        id: ["a"],
        size: Sizes.Small
      },
      {
        id: ["s"],
        size: Sizes.Large
      }
    ]
  },
  {
    name: "Destroyer A",
    type: ShipTypes[2],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.Medium
      },
      {
        id: ["F"],
        size: Sizes.Medium
      },
      {
        id: ["a"],
        size: Sizes.Medium
      },
      {
        id: RANDOM_DEFENSE,
        size: Sizes.Medium
      }
    ]
  },
  {
    name: "Destroyer B",
    type: ShipTypes[2],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.Large
      },
      {
        id: RANDOM_WEAPON,
        size: Sizes.Medium
      },
      {
        id: ["F"],
        size: Sizes.Small
      },
      {
        id: ["a"],
        size: Sizes.Small
      },
      {
        id: ["s"],
        size: Sizes.Small
      }
    ]
  },
  {
    name: "Destroyer C",
    type: ShipTypes[2],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.Medium
      },
      {
        id: ["F"],
        size: Sizes.Small
      },
      {
        id: ["a"],
        size: Sizes.Small
      },
      {
        id: ["s"],
        size: Sizes.ExtraLarge
      }
    ]
  },
  {
    name: "Cruiser A",
    type: ShipTypes[3],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.ExtraLarge
      },
      {
        id: ["R"],
        size: Sizes.Medium
      },
      {
        id: ["a"],
        size: Sizes.Medium
      },
      {
        id: ["s"],
        size: Sizes.Medium
      }
    ]
  },
  {
    name: "Cruiser B",
    type: ShipTypes[3],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.Medium
      },
      {
        id: RANDOM_WEAPON,
        size: Sizes.Medium
      },
      {
        id: ["F"],
        size: Sizes.Medium
      },
      {
        id: ["a"],
        size: Sizes.Medium
      },
      {
        id: ["s"],
        size: Sizes.Medium
      }
    ]
  },
  {
    name: "Cruiser C",
    type: ShipTypes[3],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.Medium
      },
      {
        id: ["R"],
        size: Sizes.Medium
      },
      {
        id: ["a"],
        size: Sizes.Large
      },
      {
        id: ["s"],
        size: Sizes.Large
      }
    ]
  },
  {
    name: "Battlecruiser A",
    type: ShipTypes[4],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.Large
      },
      {
        id: RANDOM_GENERATOR,
        size: Sizes.Large
      },
      {
        id: ["a"],
        size: Sizes.Large
      },
      {
        id: ["s"],
        size: Sizes.Large
      }
    ]
  },
  {
    name: "Battlecruiser B",
    type: ShipTypes[4],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.Medium
      },
      {
        id: RANDOM_WEAPON,
        size: Sizes.Medium
      },
      {
        id: ["F"],
        size: Sizes.Medium
      },
      {
        id: ["a"],
        size: Sizes.Large
      },
      {
        id: ["s"],
        size: Sizes.Large
      }
    ]
  },
  {
    name: "Battlecruiser C",
    type: ShipTypes[4],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.Medium
      },
      {
        id: ["F"],
        size: Sizes.Medium
      },
      {
        id: ["a"],
        size: Sizes.ExtraLarge
      },
      {
        id: ["s"],
        size: Sizes.ExtraLarge
      }
    ]
  },
  {
    name: "Battleship A",
    type: ShipTypes[5],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.ExtraLarge
      },
      {
        id: ["R"],
        size: Sizes.Medium
      },
      {
        id: ["a"],
        size: Sizes.ExtraLarge
      },
      {
        id: ["s"],
        size: Sizes.ExtraLarge
      }
    ]
  },
  {
    name: "Battleship B",
    type: ShipTypes[5],
    modules: [
      {
        id: RANDOM_WEAPON,
        size: Sizes.Medium
      },
      {
        id: RANDOM_WEAPON,
        size: Sizes.Medium
      },
      {
        id: ["F"],
        size: Sizes.Medium
      },
      {
        id: ["a"],
        size: Sizes.ExtraLarge
      },
      {
        id: ["s"],
        size: Sizes.ExtraLarge
      }
    ]
  }
];

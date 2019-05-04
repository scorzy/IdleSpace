import { ShipTypes, ShipType, DefenseTypes } from "../fleet/shipTypes";
import { Sizes } from "../fleet/module";

export class Preset {
  static CORVETTE_PRESET: Preset;
  static DefenseShield: Preset;
  static Presets: Preset[];
  static DefensePreset: Preset[];

  name: string;
  type: ShipType;
  modules: Array<{ id: string[]; size: Sizes }>;

  static initPreset() {
    Preset.CORVETTE_PRESET = {
      name: "Corvette",
      type: ShipTypes[0],
      modules: [
        {
          id: ["l"],
          size: Sizes.Small
        },
        {
          id: ["S"],
          size: Sizes.Small
        },
        {
          id: ["a"],
          size: Sizes.Small
        }
      ]
    };
    Preset.Presets = [
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
    Preset.DefensePreset = [
      {
        name: "Small",
        type: DefenseTypes[0],
        modules: [
          {
            id: RANDOM_WEAPON,
            size: Sizes.Small
          },
          {
            id: ["s"],
            size: Sizes.Small
          },
          {
            id: ["a"],
            size: Sizes.Small
          },
          {
            id: ["a"],
            size: Sizes.Small
          }
        ]
      },
      {
        name: "Medium",
        type: DefenseTypes[1],
        modules: [
          {
            id: RANDOM_WEAPON,
            size: Sizes.Medium
          },
          {
            id: ["s"],
            size: Sizes.Medium
          },
          {
            id: ["a"],
            size: Sizes.Medium
          },
          {
            id: ["a"],
            size: Sizes.Medium
          }
        ]
      },
      {
        name: "Large",
        type: DefenseTypes[2],
        modules: [
          {
            id: RANDOM_WEAPON,
            size: Sizes.Large
          },
          {
            id: ["s"],
            size: Sizes.Large
          },
          {
            id: ["a"],
            size: Sizes.Large
          },
          {
            id: ["a"],
            size: Sizes.Large
          }
        ]
      },
      {
        name: "Extra Large",
        type: DefenseTypes[3],
        modules: [
          {
            id: RANDOM_WEAPON,
            size: Sizes.ExtraLarge
          },
          {
            id: ["s"],
            size: Sizes.ExtraLarge
          },
          {
            id: ["a"],
            size: Sizes.ExtraLarge
          },
          {
            id: ["a"],
            size: Sizes.ExtraLarge
          }
        ]
      }
    ];
    Preset.DefenseShield = {
      name: "Shield Bubble",
      type: DefenseTypes[3],
      modules: [
        {
          id: ["s"],
          size: Sizes.ExtraLarge
        },
        {
          id: ["s"],
          size: Sizes.ExtraLarge
        },
        {
          id: ["s"],
          size: Sizes.ExtraLarge
        },
        {
          id: ["a"],
          size: Sizes.ExtraLarge
        }
      ]
    };
  }
}
const RANDOM_WEAPON = ["l", "p", "d", "g"];
const RANDOM_DEFENSE = ["a", "s"];
const RANDOM_GENERATOR = ["S", "R", "F"];

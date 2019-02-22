import { Module } from "./module";
import { descriptions } from "../descriptions";

export class Weapon extends Module {
  constructor(id: string) {
    super(id);
    this.name = descriptions.weapons[id][0];
  }
}

import { ISalvable } from "../base/ISalvable";

export class Enemy implements ISalvable {
  name = "";
  level = 0;

  getSave() {
    throw new Error("Method not implemented.");
  }
  load(data: any): boolean {
    throw new Error("Method not implemented.");
  }
}

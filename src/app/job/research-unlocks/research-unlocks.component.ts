import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Research } from "src/app/model/research/research";
import { IUnlockable } from "src/app/model/base/IUnlockable";
import { Resource } from "src/app/model/resource/resource";
import { ShipClass } from "src/app/model/fleet/class";

@Component({
  selector: "app-research-unlocks",
  templateUrl: "./research-unlocks.component.html",
  styleUrls: ["./research-unlocks.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResearchUnlocksComponent implements OnInit {
  @Input() res: Research;

  constructor() {}

  ngOnInit() {}

  getId(index: number, unlock: IUnlockable) {
    return index + unlock.id;
  }
  getType(unlock: IUnlockable): string {
    let ret = "";
    if (unlock instanceof Research) {
      ret = "Research";
    } else if (unlock instanceof Resource) {
      ret = "Resource";
    }
    return ret;
  }
  getBonId(index: number, bonus: [string, string]) {
    return index + bonus[0] + bonus[1];
  }
  getClaId(index: number, cla: ShipClass) {
    return cla.id;
  }
}

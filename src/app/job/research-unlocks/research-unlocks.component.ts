import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from "@angular/core";
import { Research } from "src/app/model/research/research";
import { IUnlockable } from "src/app/model/base/IUnlockable";
import { Resource } from "src/app/model/resource/resource";

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
}

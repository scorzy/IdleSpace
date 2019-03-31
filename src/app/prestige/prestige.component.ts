import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";
import { MainService } from "../main.service";
import { Skill } from "../model/prestige/skill";

@Component({
  selector: "app-prestige",
  templateUrl: "./prestige.component.html",
  styleUrls: ["./prestige.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrestigeComponent implements OnInit {
  @HostBinding("class")
  contentContainer = "content-container";

  constructor(public ms: MainService) {}

  ngOnInit() {}

  getClass(skill: Skill): string {
    return "";
  }

  trackByRow(index: number, row: Skill[]) {
    return index;
  }
  trackByCell(index: number, skill: Skill) {
    return skill.id;
  }

  openBuyModal(skill: Skill) {
    if (skill.owned || !skill.buyable) return false;
  }
}

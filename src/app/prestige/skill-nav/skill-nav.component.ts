import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding
} from "@angular/core";
import { SkillGroup } from "src/app/model/prestige/skillGroup";
import { SkillGroups } from "src/app/model/prestige/allSkillEffects";
import { MainService } from "src/app/main.service";

@Component({
  selector: "app-skill-nav",
  templateUrl: "./skill-nav.component.html",
  styleUrls: ["./skill-nav.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillNavComponent implements OnInit {
  @HostBinding("class")
  contentContainer = "content-container";

  SkillGroups = SkillGroups;

  constructor(public ms: MainService) {}

  ngOnInit() {}

  getGroupId(index: number, group: SkillGroup) {
    return group.id;
  }
}

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef
} from "@angular/core";
import { MainService } from "src/app/main.service";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { SkillGroups } from "src/app/model/prestige/allSkillEffects";
import { SkillGroup } from "src/app/model/prestige/skillGroup";

@Component({
  selector: "app-skill-group",
  templateUrl: "./skill-group.component.html",
  styleUrls: ["./skill-group.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillGroupComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  skillGroup: SkillGroup;

  constructor(
    public ms: MainService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.route.params.subscribe(this.getGroup.bind(this)),
      this.ms.em.prestigeEmitter.subscribe(() => {
        this.cd.markForCheck();
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getGroup(params: any) {
    const id = params.id;
    if (id === undefined) {
      this.skillGroup = SkillGroups[0];
      return false;
    }
    this.skillGroup = SkillGroups.find(g => g.id === id);
    this.skillGroup.skills.map(s => s.buyAction).forEach(a => a.reload());
    this.cd.markForCheck();
  }
  getSkillId(index: number, skill: SkillGroup) {
    return skill.id;
  }
}

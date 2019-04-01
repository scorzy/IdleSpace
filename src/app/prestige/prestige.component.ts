import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  OnChanges
} from "@angular/core";
import { MainService } from "../main.service";
import { Skill } from "../model/prestige/skill";
import { AllSkillEffects } from "../model/prestige/allSkillEffects";

@Component({
  selector: "app-prestige",
  templateUrl: "./prestige.component.html",
  styleUrls: ["./prestige.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrestigeComponent implements OnInit, OnChanges {
  constructor(public ms: MainService) {}
  @HostBinding("class")
  contentContainer = "content-container";
  buyModal = false;
  selectedSkill: Skill;
  skillsList: string[];
  prestigeModal = false;

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    this.reloadList();
  }

  ngOnInit() {
    this.reloadList();
  }

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
    if (
      skill.owned ||
      !skill.buyable ||
      this.ms.game.prestigeManager.totalPrestige <=
        this.ms.game.prestigeManager.usedPrestige
    ) {
      return false;
    }
    this.buyModal = true;
    this.selectedSkill = skill;
  }
  buy() {
    this.selectedSkill.buy();
    this.buyModal = false;
    this.selectedSkill = null;
    this.reloadList();
  }
  close() {
    this.selectedSkill = null;
    this.buyModal = false;
  }
  descID(index: number, desc: string) {
    return desc;
  }
  reloadList() {
    this.skillsList = AllSkillEffects.effectList
      .filter(e => e.numOwned > 0)
      .map(e => e.getDescription(e.numOwned));
  }
  prestige() {
    this.ms.game.prestige();
    this.prestigeModal = false;
  }
}

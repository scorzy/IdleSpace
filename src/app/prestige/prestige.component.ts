import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnChanges,
  ViewChild,
  ElementRef,
  SimpleChanges,
  AfterViewInit
} from "@angular/core";
import { MainService } from "../main.service";
import { AllSkillEffects } from "../model/prestige/allSkillEffects";
import { SkillEffect } from "../model/prestige/skillEffects";
declare let preventScroll;

@Component({
  selector: "app-prestige",
  templateUrl: "./prestige.component.html",
  styleUrls: ["./prestige.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrestigeComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild("network")
  networkDiv: ElementRef;
  networkVis: any; // Network;

  buyModal = false;
  effect: SkillEffect;
  skillsList: string[];
  prestigeModal = false;
  ascendModal = false;
  node: any;
  exp = "";
  canAscend = false;
  availableSkill = SkillEffect.availableSkill;

  constructor(public ms: MainService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.reloadList();
  }
  ngOnInit() {
    this.canAscend = this.ms.game.prestigeManager.canAscend();
    this.reloadList();
  }
  ngAfterViewInit(): void {
    if (typeof preventScroll === typeof Function) preventScroll();
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
    this.canAscend = this.ms.game.prestigeManager.canAscend();
    this.prestigeModal = false;
    this.reloadList();

    try {
      this.ms.sendKong();
    } catch (ex) {}
  }
  ascend() {
    this.ms.game.ascend();
    this.canAscend = this.ms.game.prestigeManager.canAscend();
    this.ascendModal = false;
    this.reloadList();

    try {
      this.ms.sendKong();
    } catch (ex) {}
  }
}

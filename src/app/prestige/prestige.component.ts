import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostBinding,
  OnChanges,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  SimpleChanges
} from "@angular/core";
import { MainService } from "../main.service";
import { Skill } from "../model/prestige/skill";
import { AllSkillEffects } from "../model/prestige/allSkillEffects";
import { Network } from "vis";
import { SkillEffect } from "../model/prestige/skillEffects";
import { preventScroll } from "../app.component";

@Component({
  selector: "app-prestige",
  templateUrl: "./prestige.component.html",
  styleUrls: ["./prestige.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PrestigeComponent implements OnInit, OnChanges, AfterViewInit {
  @HostBinding("class")
  contentContainer = "content-container";

  @ViewChild("network")
  networkDiv: ElementRef;
  networkVis: any; // Network;

  buyModal = false;
  selectedSkill: Skill;
  effect: SkillEffect;
  skillsList: string[];
  prestigeModal = false;
  ascendModal = false;
  node: any;
  exp = "";
  canAscend = false;

  constructor(public ms: MainService, private cd: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.reloadList();
  }
  ngOnInit() {
    this.canAscend = this.ms.game.prestigeManager.canAscend();
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
    this.effect = AllSkillEffects.effectList.find(e => e.id === skill.effectId);
  }
  buy() {
    this.ms.game.prestigeManager.buySkill(this.selectedSkill.id);
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
    this.canAscend = this.ms.game.prestigeManager.canAscend();
    this.prestigeModal = false;
    this.reloadList();
  }
  ascend() {
    this.ms.game.ascend();
    this.canAscend = this.ms.game.prestigeManager.canAscend();
    this.ascendModal = false;
    this.reloadList();
  }

  ngAfterViewInit() {
    if (typeof preventScroll === typeof Function) preventScroll();
    setTimeout(() => {
      const myNodes: any = this.ms.game.prestigeManager.visSkills;
      const myEedges: any = this.ms.game.prestigeManager.visEdge;
      this.networkVis = new Network(
        this.networkDiv.nativeElement,
        {
          nodes: myNodes,
          edges: myEedges
        },
        {
          nodes: { borderWidth: 2 },
          edges: {
            smooth: {
              enabled: true,
              type: "dynamic",
              roundness: 0.5
            }
          },
          interaction: { dragNodes: false, hover: true },
          physics: {
            enabled: false,
            barnesHut: {
              gravitationalConstant: -3000,
              avoidOverlap: 0.4
            },
            minVelocity: 1
          }
        }
      );
      this.networkVis.on("click", params => {
        const masteryBuy = params.nodes[0];

        this.node =
          masteryBuy || masteryBuy === 0
            ? this.ms.game.prestigeManager.visSkills.get(masteryBuy)
            : null;

        this.openBuyModal(this.node);

        this.cd.markForCheck();
      });
    }, 0);
  }

  export() {
    this.networkVis.storePositions();
    this.exp = JSON.stringify(this.networkVis.getPositions());
  }
}

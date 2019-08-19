import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ResourceComponent } from "./resource/resource.component";
import { LabComponent } from "./lab/lab.component";
import { OptionsNavComponent } from "./options-nav/options-nav.component";
import { SaveComponent } from "./options-nav/save/save.component";
import { FleetDesignerComponent } from "./fleetDesigner/fleetDesigner.component";
import { DesignComponent } from "./fleetDesigner/design/design.component";
import { UiComponent } from "./options-nav/ui/ui.component";
import { BattleMenuComponent } from "./battle/battle.component";
import { EnemiesComponent } from "./enemies/enemies.component";
import { EnemyViewComponent } from "./enemies/enemy-view/enemy-view.component";
import { SearchComponent } from "./enemies/search/search.component";
import { ShipyardComponent } from "./fleetDesigner/shipyard/shipyard.component";
import { PrestigeComponent } from "./prestige/prestige.component";
import { GroupTabComponent } from "./group-tab/group-tab.component";
import { NotificationsComponent } from "./options-nav/notifications/notifications.component";
import { DarkMatterComponent } from "./dark-matter/dark-matter.component";
import { InfoComponent } from "./info/info.component";
import { StartComponent } from "./info/start/start.component";
import { LabInfoComponent } from "./info/lab-info/lab-info.component";
import { ShipyardInfoComponent } from "./info/shipyard-info/shipyard-info.component";
import { AutomatorTableComponent } from "./prestige/automator-table/automator-table.component";
import { AutoShipComponent } from "./fleetDesigner/auto-ship/auto-ship.component";
import { EnemyInfoComponent } from "./info/enemy-info/enemy-info.component";
import { PrestigeInfoComponent } from "./info/prestige-info/prestige-info.component";
import { InfoModComponent } from "./info/info-mod/info-mod.component";
import { AutoInfoComponent } from "./info/auto-info/auto-info.component";
import { AscendInfoComponent } from "./info/ascend-info/ascend-info.component";
import { CreditsComponent } from "./options-nav/credits/credits.component";
import { ChangelogComponent } from "./info/changelog/changelog.component";
import { AutomatorsComponent } from "./automator-group/automators/automators.component";
import { SkillNavComponent } from "./prestige/skill-nav/skill-nav.component";
import { SkillGroupComponent } from "./prestige/skill-group/skill-group.component";
import { LabTabsComponent } from "./lab/lab-tabs/lab-tabs.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "home/res/m",
    pathMatch: "full"
  },
  {
    path: "home",
    component: HomeComponent,
    children: [
      { path: "res", component: ResourceComponent },
      { path: "res/:id", component: ResourceComponent },
      { path: "group/:id", component: GroupTabComponent }
    ]
  },
  {
    path: "lab",
    component: LabTabsComponent
  },
  {
    path: "fleet",
    redirectTo: "fleet/shipyard",
    pathMatch: "full"
  },
  {
    path: "fleet",
    component: FleetDesignerComponent,
    children: [
      { path: "shipyard", component: ShipyardComponent },
      { path: "autoShip", component: AutoShipComponent },
      { path: "design", component: DesignComponent },
      { path: "design/:id", component: DesignComponent }
    ]
  },
  {
    path: "enemies",
    redirectTo: "enemies/search",
    pathMatch: "full"
  },
  {
    path: "enemies",
    component: EnemiesComponent,
    children: [
      {
        path: "view/:id",
        component: EnemyViewComponent
      },
      {
        path: "search",
        component: SearchComponent
      }
    ]
  },
  {
    path: "battle",
    component: BattleMenuComponent
  },
  {
    path: "opt",
    component: OptionsNavComponent,
    children: [
      { path: "save", component: SaveComponent },
      { path: "ui", component: UiComponent },
      { path: "noti", component: NotificationsComponent },
      { path: "credits", component: CreditsComponent }
    ]
  },
  {
    path: "prestige",
    redirectTo: "prestige/pre",
    pathMatch: "full"
  },
  {
    path: "prestige",
    component: SkillNavComponent,
    children: [
      { path: "pre", component: PrestigeComponent },
      { path: "grp/:id", component: SkillGroupComponent }
    ]
  },
  {
    path: "autoTable",
    component: AutomatorTableComponent
  },
  {
    path: "darkMatter",
    component: DarkMatterComponent
  },
  {
    path: "info",
    redirectTo: "info/start",
    pathMatch: "full"
  },
  {
    path: "info",
    component: InfoComponent,
    children: [
      { path: "start", component: StartComponent },
      { path: "labInfo", component: LabInfoComponent },
      { path: "shipyardInfo", component: ShipyardInfoComponent },
      { path: "eneInfo", component: EnemyInfoComponent },
      { path: "modInfo", component: InfoModComponent },
      { path: "prestigeInfo", component: PrestigeInfoComponent },
      { path: "autoInfo", component: AutoInfoComponent },
      { path: "ascendInfo", component: AscendInfoComponent },
      { path: "changelog", component: ChangelogComponent }
    ]
  },
  {
    path: "auto",
    component: AutomatorsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

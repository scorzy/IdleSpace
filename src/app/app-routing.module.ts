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
    component: LabComponent
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
      { path: "noti", component: NotificationsComponent }
    ]
  },
  {
    path: "prestige",
    component: PrestigeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

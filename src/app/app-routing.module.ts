import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { ResourceComponent } from "./resource/resource.component";
import { LabComponent } from "./lab/lab.component";
import { OptionsNavComponent } from "./options-nav/options-nav.component";
import { SaveComponent } from "./options-nav/save/save.component";
import { FleetDesignerComponent } from "./fleetDesigner/fleetDesigner.component";
import { DesignComponent } from "./fleetDesigner/design/design.component";

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
      { path: "res/:id", component: ResourceComponent }
      // { path: "group/:id", component: GroupTabsComponent }
    ]
  },
  {
    path: "lab",
    component: LabComponent
  },
  {
    path: "fleet",
    component: FleetDesignerComponent,
    children: [
      { path: "design", component: DesignComponent },
      { path: "design/:id", component: DesignComponent }
    ]
  },
  {
    path: "opt",
    component: OptionsNavComponent,
    children: [{ path: "save", component: SaveComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

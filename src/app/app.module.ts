import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ClarityModule } from "@clr/angular";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MainService } from "./main.service";
import { HomeComponent } from "./home/home.component";
import { ResLineComponent } from "./home/res-line/res-line.component";
import { FormatPipe } from "./format.pipe";
import { ResourceComponent } from "./resource/resource.component";
import { ResourceOverviewComponent } from "./resource-overview/resource-overview.component";
import { MaterialListComponent } from "./material-list/material-list.component";
import { TabComponent } from "./material-list/tab/tab.component";
import { Ng5SliderModule } from "ng5-slider";
import { ActionComponent } from "./action/action.component";
import { ActionHeaderComponent } from "./action/action-header/action-header.component";
import { ButtonsComponent } from "./action/buttons/buttons.component";
import { CantBuySignpostsComponent } from "./action/cant-buy-signposts/cant-buy-signposts.component";
import { PriceLineComponent } from "./action/price-line/price-line.component";
import { EndInPipe } from "./end-in.pipe";
import { PolynomComponent } from "./polynom/polynom.component";
import { FormsModule } from "@angular/forms";
import { OptionsService } from "./options.service";
import { FormattedQuantityComponent } from "./formatted-quantity/formatted-quantity.component";
import { LabComponent } from "./lab/lab.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ResearchComponent } from "./lab/research/research.component";
import { RomanPipe } from "./roman.pipe";
import { OptionsNavComponent } from "./options-nav/options-nav.component";
import { SaveComponent } from "./options-nav/save/save.component";
import { FleetDesignerComponent } from "./fleetDesigner/fleetDesigner.component";
import { DesignComponent } from "./fleetDesigner/design/design.component";
import { EditorComponent } from "./fleetDesigner/editor/editor.component";
import { ViewComponent } from "./fleetDesigner/view/view.component";
import { SizesPipe } from "./sizes.pipe";
import { ProductionTablesComponent } from "./production-tables/production-tables.component";
import { UiComponent } from "./options-nav/ui/ui.component";
import { BattleMenuComponent } from "./battle-menu/battle-menu.component";
import { EnemiesComponent } from "./enemies/enemies.component";
import { EnemyViewComponent } from "./enemies/enemy-view/enemy-view.component";
import { SizeNamePipe } from "./size-name.pipe";
import { SearchComponent } from "./enemies/search/search.component";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ResLineComponent,
    FormatPipe,
    ResourceComponent,
    ResourceOverviewComponent,
    MaterialListComponent,
    TabComponent,
    ActionComponent,
    ActionHeaderComponent,
    ButtonsComponent,
    CantBuySignpostsComponent,
    PriceLineComponent,
    EndInPipe,
    PolynomComponent,
    FormattedQuantityComponent,
    LabComponent,
    ResearchComponent,
    RomanPipe,
    OptionsNavComponent,
    SaveComponent,
    FleetDesignerComponent,
    DesignComponent,
    EditorComponent,
    ViewComponent,
    SizesPipe,
    ProductionTablesComponent,
    UiComponent,
    BattleMenuComponent,
    EnemiesComponent,
    EnemyViewComponent,
    SizeNamePipe,
    SearchComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    Ng5SliderModule,
    FormsModule,
    DragDropModule
  ],
  providers: [MainService, OptionsService],
  bootstrap: [AppComponent],
  exports: [PolynomComponent]
})
export class AppModule {}

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
    PolynomComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ClarityModule,
    Ng5SliderModule,
    FormsModule
  ],
  providers: [MainService, OptionsService],
  bootstrap: [AppComponent],
  exports: [PolynomComponent]
})
export class AppModule {}

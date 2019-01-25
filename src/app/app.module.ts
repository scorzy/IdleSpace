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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ResLineComponent,
    FormatPipe,
    ResourceComponent,
    ResourceOverviewComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    ClarityModule
  ],
  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule {}

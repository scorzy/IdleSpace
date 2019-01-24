import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ClarityModule } from "@clr/angular";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MainService } from "./main.service";
import { HomeComponent } from './home/home.component';
import { ResLineComponent } from './home/res-line/res-line.component';
import { FormatPipe } from './format.pipe';

@NgModule({
  declarations: [AppComponent, HomeComponent, ResLineComponent, FormatPipe],
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

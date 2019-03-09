import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ResearchComponent } from "./research.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ClarityModule } from "@clr/angular";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActionHeaderComponent } from "src/app/action/action-header/action-header.component";
import { FormatPipe } from "src/app/format.pipe";
import { Research } from "src/app/model/research/research";
import { ResearchData } from "src/app/model/research/researchData";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";

describe("ResearchComponent", () => {
  let component: ResearchComponent;
  let fixture: ComponentFixture<ResearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ClarityModule, RouterTestingModule, BrowserAnimationsModule],
      declarations: [ResearchComponent, ActionHeaderComponent, FormatPipe],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchComponent);
    component = fixture.componentInstance;
    component.ms.start();
    component.res = Research.fromData(ResearchData[0]);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ResearchUnlocksComponent } from "./research-unlocks.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport } from "src/app/app.component.spec";
import { ActionHeaderComponent } from "src/app/action/action-header/action-header.component";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { Research } from "src/app/model/research/research";
import { ResearchData } from "src/app/model/research/researchData";

describe("ResearchUnlocksComponent", () => {
  let component: ResearchUnlocksComponent;
  let fixture: ComponentFixture<ResearchUnlocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [
        ResearchUnlocksComponent,
        ActionHeaderComponent,
        FormatPipe
      ],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchUnlocksComponent);
    component = fixture.componentInstance;
    component.res = Research.fromData(ResearchData[0]);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

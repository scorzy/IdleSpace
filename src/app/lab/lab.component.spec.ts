import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LabComponent } from "./lab.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ClarityModule } from "@clr/angular";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActionHeaderComponent } from "../action/action-header/action-header.component";
import { FormatPipe } from "../format.pipe";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";

describe("LabComponent", () => {
  let component: LabComponent;
  let fixture: ComponentFixture<LabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ClarityModule, RouterTestingModule, BrowserAnimationsModule],
      declarations: [LabComponent, ActionHeaderComponent, FormatPipe],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

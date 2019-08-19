import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { LabAutoComponent } from "./lab-auto.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport } from "src/app/app.component.spec";
import { ActionHeaderComponent } from "src/app/action/action-header/action-header.component";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";

describe("LabAutoComponent", () => {
  let component: LabAutoComponent;
  let fixture: ComponentFixture<LabAutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [LabAutoComponent, ActionHeaderComponent, FormatPipe],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabAutoComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

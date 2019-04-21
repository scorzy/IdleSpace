import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AutomatorComponent } from "./automator.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport } from "../../app.component.spec";
import { FormatPipe } from "../../format.pipe";
import { EndInPipe } from "../../end-in.pipe";
import { SizeNamePipe } from "../../size-name.pipe";

describe("AutomatorComponent", () => {
  let component: AutomatorComponent;
  let fixture: ComponentFixture<AutomatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [AutomatorComponent, FormatPipe, EndInPipe, SizeNamePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomatorComponent);
    component = fixture.componentInstance;
    component.ms.start();
    component.auto = component.ms.game.automatorManager.automatorGroups[0];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

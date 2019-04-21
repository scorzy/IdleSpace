import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AutomatorGroupComponent } from "./automator-group.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport } from "../app.component.spec";
import { FormatPipe } from "../format.pipe";
import { EndInPipe } from "../end-in.pipe";
import { SizeNamePipe } from "../size-name.pipe";

describe("AutomatorGroupComponent", () => {
  let component: AutomatorGroupComponent;
  let fixture: ComponentFixture<AutomatorGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [
        AutomatorGroupComponent,
        FormatPipe,
        EndInPipe,
        SizeNamePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomatorGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

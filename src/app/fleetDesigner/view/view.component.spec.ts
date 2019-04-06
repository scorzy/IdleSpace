import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ViewComponent } from "./view.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ShipDesign } from "src/app/model/fleet/shipDesign";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { defaultImport } from "src/app/app.component.spec";

describe("ViewComponent", () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [ViewComponent],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    component.ms.start();
    component.design = new ShipDesign();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

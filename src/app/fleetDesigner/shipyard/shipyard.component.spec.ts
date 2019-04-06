import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ShipyardComponent } from "./shipyard.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";
import { defaultImport } from "src/app/app.component.spec";

describe("ShipyardComponent", () => {
  let component: ShipyardComponent;
  let fixture: ComponentFixture<ShipyardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [ShipyardComponent],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipyardComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AutoShipComponent } from "./auto-ship.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport } from "src/app/app.component.spec";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";

describe("AutoShipComponent", () => {
  let component: AutoShipComponent;
  let fixture: ComponentFixture<AutoShipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [AutoShipComponent],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoShipComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

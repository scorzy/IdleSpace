/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FleetDesignerComponent } from "./fleetDesigner.component";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { defaultImport } from "../app.component.spec";

describe("FleetDesignerComponent", () => {
  let component: FleetDesignerComponent;
  let fixture: ComponentFixture<FleetDesignerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [FleetDesignerComponent],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetDesignerComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

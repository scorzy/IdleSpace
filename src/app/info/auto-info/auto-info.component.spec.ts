import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AutoInfoComponent } from "./auto-info.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport } from "src/app/app.component.spec";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";

describe("AutoInfoComponent", () => {
  let component: AutoInfoComponent;
  let fixture: ComponentFixture<AutoInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [AutoInfoComponent],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ViewComponent } from "./view.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ClarityModule } from "@clr/angular";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ShipDesign } from "src/app/model/fleet/shipDesign";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";

describe("ViewComponent", () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ClarityModule,
        RouterTestingModule,
        FormsModule,
        BrowserAnimationsModule
      ],
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

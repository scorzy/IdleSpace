/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

import { EditorComponent } from "./editor.component";
import { ClarityModule } from "@clr/angular";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ShipDesign } from "src/app/model/fleet/shipDesign";
import { SizesPipe } from "src/app/sizes.pipe";
import { ShipTypes } from "src/app/model/fleet/shipTypes";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";

describe("EditorComponent", () => {
  let component: EditorComponent;
  let fixture: ComponentFixture<EditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ClarityModule,
        RouterTestingModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      declarations: [EditorComponent, SizesPipe],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorComponent);
    component = fixture.componentInstance;
    component.ms.start();
    component.design = new ShipDesign();
    component.design.type = ShipTypes[0];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

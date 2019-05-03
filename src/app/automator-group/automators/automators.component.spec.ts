import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { AutomatorsComponent } from "./automators.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport } from "../../app.component.spec";
import { FormatPipe } from "../../format.pipe";
import { EndInPipe } from "../../end-in.pipe";
import { SizeNamePipe } from "../../size-name.pipe";

describe("AutomatorsComponent", () => {
  let component: AutomatorsComponent;
  let fixture: ComponentFixture<AutomatorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [AutomatorsComponent, FormatPipe, EndInPipe, SizeNamePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomatorsComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

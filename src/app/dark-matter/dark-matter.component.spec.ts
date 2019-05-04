import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DarkMatterComponent } from "./dark-matter.component";
import { FormatPipe } from "../format.pipe";
import { defaultImport } from "../app.component.spec";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { EndInPipe } from "../end-in.pipe";

describe("DarkMatterComponent", () => {
  let component: DarkMatterComponent;
  let fixture: ComponentFixture<DarkMatterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DarkMatterComponent, FormatPipe, EndInPipe],
      imports: defaultImport(),
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DarkMatterComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

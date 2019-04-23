import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchAutoComponent } from "./search-auto.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { EndInPipe } from "src/app/end-in.pipe";

describe("SearchAutoComponent", () => {
  let component: SearchAutoComponent;
  let fixture: ComponentFixture<SearchAutoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [SearchAutoComponent, FormatPipe, EndInPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAutoComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

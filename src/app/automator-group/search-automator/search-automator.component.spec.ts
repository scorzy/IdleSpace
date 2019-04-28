import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchAutomatorComponent } from "./search-automator.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport } from "src/app/app.component.spec";
import { FormatPipe } from "src/app/format.pipe";
import { EndInPipe } from "src/app/end-in.pipe";
import { SizeNamePipe } from "src/app/size-name.pipe";

describe("SearchAutomatorComponent", () => {
  let component: SearchAutomatorComponent;
  let fixture: ComponentFixture<SearchAutomatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [
        SearchAutomatorComponent,
        FormatPipe,
        EndInPipe,
        SizeNamePipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAutomatorComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

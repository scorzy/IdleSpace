import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupTabComponent } from "./group-tab.component";
import { FormatPipe } from "../format.pipe";
import { EndInPipe } from "../end-in.pipe";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport } from "../app.component.spec";

describe("GroupTabComponent", () => {
  let component: GroupTabComponent;
  let fixture: ComponentFixture<GroupTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupTabComponent, FormatPipe, EndInPipe],
      imports: defaultImport(),
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTabComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

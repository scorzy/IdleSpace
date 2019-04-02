import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupTabComponent } from "./group-tab.component";
import { FormatPipe } from "../format.pipe";
import { EndInPipe } from "../end-in.pipe";
import { RouterTestingModule } from "@angular/router/testing";
import { ClarityModule } from "@clr/angular";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("GroupTabComponent", () => {
  let component: GroupTabComponent;
  let fixture: ComponentFixture<GroupTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupTabComponent, FormatPipe, EndInPipe],
      imports: [
        RouterTestingModule,
        ClarityModule,
        BrowserAnimationsModule,
        FormsModule
      ],
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

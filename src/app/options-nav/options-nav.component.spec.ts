import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OptionsNavComponent } from "./options-nav.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormatPipe } from "../format.pipe";
import { defaultImport } from "../app.component.spec";

describe("OptionsNavComponent", () => {
  let component: OptionsNavComponent;
  let fixture: ComponentFixture<OptionsNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [OptionsNavComponent, FormatPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OptionsNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

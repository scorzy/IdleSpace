import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OptionsNavComponent } from "./options-nav.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ClarityModule } from "@clr/angular";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormatPipe } from "../format.pipe";

describe("OptionsNavComponent", () => {
  let component: OptionsNavComponent;
  let fixture: ComponentFixture<OptionsNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ClarityModule,
        RouterTestingModule,
        FormsModule,
        BrowserAnimationsModule
      ],
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

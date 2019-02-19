import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SaveComponent } from "./save.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ClarityModule } from "@clr/angular";
import { RouterTestingModule } from "@angular/router/testing";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormatPipe } from "src/app/format.pipe";

describe("SaveComponent", () => {
  let component: SaveComponent;
  let fixture: ComponentFixture<SaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        ClarityModule,
        RouterTestingModule,
        FormsModule,
        BrowserAnimationsModule
      ],
      declarations: [SaveComponent, FormatPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

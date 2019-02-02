import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { ClarityModule } from "@clr/angular";
import { FormatPipe } from "../../format.pipe";
import { PriceLineComponent } from "./price-line.component";
import { getMainService } from "src/app/app.component.spec";

describe("PriceLineComponent", () => {
  let component: PriceLineComponent;
  let fixture: ComponentFixture<PriceLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ClarityModule, RouterTestingModule, BrowserAnimationsModule],
      declarations: [PriceLineComponent, FormatPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceLineComponent);
    component = fixture.componentInstance;
    component.unit = getMainService().game.resourceManager.metal;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

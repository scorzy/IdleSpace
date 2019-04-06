import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormatPipe } from "../../format.pipe";
import { PriceLineComponent } from "./price-line.component";
import { getGame, defaultImport } from "src/app/app.component.spec";

describe("PriceLineComponent", () => {
  let component: PriceLineComponent;
  let fixture: ComponentFixture<PriceLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [PriceLineComponent, FormatPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceLineComponent);
    component = fixture.componentInstance;
    component.unit = getGame().resourceManager.metal;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

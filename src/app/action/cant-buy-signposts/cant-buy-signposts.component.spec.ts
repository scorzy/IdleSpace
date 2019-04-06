import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { EndInPipe } from "../../end-in.pipe";
import { FormatPipe } from "../../format.pipe";
import { CantBuySignpostsComponent } from "./cant-buy-signposts.component";
import { getAction, defaultImport } from "src/app/app.component.spec";

describe("CantBuySignpostsComponent", () => {
  let component: CantBuySignpostsComponent;
  let fixture: ComponentFixture<CantBuySignpostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [CantBuySignpostsComponent, FormatPipe, EndInPipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CantBuySignpostsComponent);
    component = fixture.componentInstance;
    component.action = getAction();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

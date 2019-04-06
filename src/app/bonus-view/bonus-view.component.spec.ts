import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BonusViewComponent } from "./bonus-view.component";
import { FormatPipe } from "../format.pipe";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { getGame, defaultImport } from "../app.component.spec";

describe("BonusViewComponent", () => {
  let component: BonusViewComponent;
  let fixture: ComponentFixture<BonusViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BonusViewComponent, FormatPipe],
      imports: defaultImport(),
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusViewComponent);
    component = fixture.componentInstance;
    const game = getGame();
    component.production = game.resourceManager.alloyX1.products[0];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

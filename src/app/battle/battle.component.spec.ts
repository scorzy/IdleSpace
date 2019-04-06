import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BattleMenuComponent } from "./battle.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormatPipe } from "../format.pipe";
import { EndInPipe } from "../end-in.pipe";
import { SizeNamePipe } from "../size-name.pipe";
import { defaultImport } from "../app.component.spec";

describe("BattleMenuComponent", () => {
  let component: BattleMenuComponent;
  let fixture: ComponentFixture<BattleMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [BattleMenuComponent, FormatPipe, EndInPipe, SizeNamePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMenuComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BattleMenuComponent } from "./battle-menu.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("BattleMenuComponent", () => {
  let component: BattleMenuComponent;
  let fixture: ComponentFixture<BattleMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [BattleMenuComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

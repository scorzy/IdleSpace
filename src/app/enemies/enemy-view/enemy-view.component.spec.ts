import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EnemyViewComponent } from "./enemy-view.component";
import { FormatPipe } from "src/app/format.pipe";
import { EndInPipe } from "src/app/end-in.pipe";
import { Enemy } from "src/app/model/enemy/enemy";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { SizeNamePipe } from "src/app/size-name.pipe";
import { defaultImport } from "src/app/app.component.spec";
import { SearchJob } from "src/app/model/enemy/searchJob";

describe("EnemyViewComponent", () => {
  let component: EnemyViewComponent;
  let fixture: ComponentFixture<EnemyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [EnemyViewComponent, FormatPipe, EndInPipe, SizeNamePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnemyViewComponent);
    component = fixture.componentInstance;
    component.ms.start();
    component.enemy = Enemy.generate(new SearchJob());
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

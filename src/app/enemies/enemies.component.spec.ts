import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { EnemiesComponent } from "./enemies.component";
import { FormatPipe } from "../format.pipe";
import { EndInPipe } from "../end-in.pipe";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";
import { defaultImport } from "../app.component.spec";

describe("EnemiesComponent", () => {
  let component: EnemiesComponent;
  let fixture: ComponentFixture<EnemiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [EnemiesComponent, FormatPipe, EndInPipe],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnemiesComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

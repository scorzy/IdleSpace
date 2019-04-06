import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ModdingComponent } from "./modding.component";
import { FormatPipe } from "../format.pipe";
import { EndInPipe } from "../end-in.pipe";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport } from "../app.component.spec";

describe("ModdingComponent", () => {
  let component: ModdingComponent;
  let fixture: ComponentFixture<ModdingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModdingComponent, FormatPipe, EndInPipe],
      imports: defaultImport(),
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModdingComponent);
    component = fixture.componentInstance;
    component.ms.start();
    component.res = component.ms.game.resourceManager.metalX1;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ResourceGroupComponent } from "./resource-group.component";
import { FormatPipe } from "src/app/format.pipe";
import { EndInPipe } from "src/app/end-in.pipe";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport } from "src/app/app.component.spec";

describe("ResourceGroupComponent", () => {
  let component: ResourceGroupComponent;
  let fixture: ComponentFixture<ResourceGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceGroupComponent, FormatPipe, EndInPipe],
      imports: defaultImport(),
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceGroupComponent);
    component = fixture.componentInstance;
    component.ms.start();
    component.resourceGroup = component.ms.game.resourceManager.tierGroups[1];
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

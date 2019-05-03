import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ResourceOverviewComponent } from "./resource-overview.component";
import { FormatPipe } from "../format.pipe";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { EndInPipe } from "../end-in.pipe";
import { defaultImport } from "../app.component.spec";

describe("ResourceOverviewComponent", () => {
  let component: ResourceOverviewComponent;
  let fixture: ComponentFixture<ResourceOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceOverviewComponent, FormatPipe, EndInPipe],
      imports: defaultImport(),
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceOverviewComponent);
    component = fixture.componentInstance;
    component.ms.start();
    component.res = component.ms.game.resourceManager.alloy;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

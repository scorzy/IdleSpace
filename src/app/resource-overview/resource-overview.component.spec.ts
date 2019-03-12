import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ResourceOverviewComponent } from "./resource-overview.component";
import { FormatPipe } from "../format.pipe";
import { RouterTestingModule } from "@angular/router/testing";
import { ClarityModule } from "@clr/angular";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { EndInPipe } from "../end-in.pipe";

describe("ResourceOverviewComponent", () => {
  let component: ResourceOverviewComponent;
  let fixture: ComponentFixture<ResourceOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceOverviewComponent, FormatPipe, EndInPipe],
      imports: [RouterTestingModule, ClarityModule, BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

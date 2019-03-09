import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ResourceComponent } from "./resource.component";
import { FormatPipe } from "../format.pipe";
import { RouterTestingModule } from "@angular/router/testing";
import { ClarityModule } from "@clr/angular";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";

describe("ResourceComponent", () => {
  let component: ResourceComponent;
  let fixture: ComponentFixture<ResourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResourceComponent, FormatPipe],
      imports: [RouterTestingModule, ClarityModule, BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ResLineComponent } from "./res-line.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ClarityModule } from "@clr/angular";
import { RouterTestingModule } from "@angular/router/testing";
import { OptionsService } from "../../options.service";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormatPipe } from "../../format.pipe";
import { Resource } from "../../model/resource/resource";

describe("ResLineComponent", () => {
  let component: ResLineComponent;
  let fixture: ComponentFixture<ResLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResLineComponent, FormatPipe],
      imports: [RouterTestingModule, ClarityModule, BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResLineComponent);
    component = fixture.componentInstance;
    component.os = new OptionsService();
    component.res = new Resource("m");
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

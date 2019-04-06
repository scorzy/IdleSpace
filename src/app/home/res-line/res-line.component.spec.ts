import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ResLineComponent } from "./res-line.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { OptionsService } from "../../options.service";
import { FormatPipe } from "../../format.pipe";
import { Resource } from "../../model/resource/resource";
import { MainService } from "src/app/main.service";
import { defaultImport } from "src/app/app.component.spec";

describe("ResLineComponent", () => {
  let component: ResLineComponent;
  let fixture: ComponentFixture<ResLineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResLineComponent, FormatPipe],
      imports: defaultImport(),
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResLineComponent);
    component = fixture.componentInstance;
    component.ms.start();
    component.os = new OptionsService();
    component.c = new Decimal(1);
    component.id = "10";
    component.isEnding = false;
    component.name = "name";
    component.unit = new Resource("m");
    // component.quantity = new Decimal(1);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

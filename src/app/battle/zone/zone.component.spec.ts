import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ZoneComponent } from "./zone.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { FormatPipe } from "src/app/format.pipe";
import { EndInPipe } from "src/app/end-in.pipe";
import { SizeNamePipe } from "src/app/size-name.pipe";
import { Zone } from "src/app/model/enemy/zone";
import { defaultImport } from "src/app/app.component.spec";

describe("ZoneComponent", () => {
  let component: ZoneComponent;
  let fixture: ComponentFixture<ZoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [ZoneComponent, FormatPipe, EndInPipe, SizeNamePipe]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoneComponent);
    component = fixture.componentInstance;
    component.zone = new Zone();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

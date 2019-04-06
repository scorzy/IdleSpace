import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormattedQuantityComponent } from "./formatted-quantity.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ActionHeaderComponent } from "../action/action-header/action-header.component";
import { FormatPipe } from "../format.pipe";
import { defaultImport } from "../app.component.spec";

describe("FormattedQuantityComponent", () => {
  let component: FormattedQuantityComponent;
  let fixture: ComponentFixture<FormattedQuantityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [
        FormattedQuantityComponent,
        ActionHeaderComponent,
        FormatPipe
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormattedQuantityComponent);
    component = fixture.componentInstance;
    component.quantity = new Decimal(1);
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

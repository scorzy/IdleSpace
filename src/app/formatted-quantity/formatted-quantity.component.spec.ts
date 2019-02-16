import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { FormattedQuantityComponent } from "./formatted-quantity.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ClarityModule } from "@clr/angular";
import { RouterTestingModule } from "@angular/router/testing";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ActionHeaderComponent } from "../action/action-header/action-header.component";
import { FormatPipe } from "../format.pipe";

describe("FormattedQuantityComponent", () => {
  let component: FormattedQuantityComponent;
  let fixture: ComponentFixture<FormattedQuantityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ClarityModule, RouterTestingModule, BrowserAnimationsModule],
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

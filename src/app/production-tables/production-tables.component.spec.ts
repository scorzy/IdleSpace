import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProductionTablesComponent } from "./production-tables.component";
import { FormatPipe } from "../format.pipe";
import { RouterTestingModule } from "@angular/router/testing";
import { ClarityModule } from "@clr/angular";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("ProductionTablesComponent", () => {
  let component: ProductionTablesComponent;
  let fixture: ComponentFixture<ProductionTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionTablesComponent, FormatPipe],
      imports: [RouterTestingModule, ClarityModule, BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductionTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ProductionTablesComponent } from "./production-tables.component";
import { FormatPipe } from "../format.pipe";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport } from "../app.component.spec";

describe("ProductionTablesComponent", () => {
  let component: ProductionTablesComponent;
  let fixture: ComponentFixture<ProductionTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionTablesComponent, FormatPipe],
      imports: defaultImport(),
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

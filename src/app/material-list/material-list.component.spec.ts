import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MaterialListComponent } from "./material-list.component";
import { FormatPipe } from "../format.pipe";
import { RouterTestingModule } from "@angular/router/testing";
import { ClarityModule } from "@clr/angular";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MainService } from "../main.service";
import { OptionsService } from "../options.service";

describe("MaterialListComponent", () => {
  let component: MaterialListComponent;
  let fixture: ComponentFixture<MaterialListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialListComponent, FormatPipe],
      imports: [RouterTestingModule, ClarityModule, BrowserAnimationsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [MainService, OptionsService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialListComponent);
    component = fixture.componentInstance;
    component.ms.start();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

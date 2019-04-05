import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ModdingComponent } from "./modding.component";
import { FormatPipe } from "../format.pipe";
import { EndInPipe } from "../end-in.pipe";
import { RouterTestingModule } from "@angular/router/testing";
import { ClarityModule } from "@clr/angular";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("ModdingComponent", () => {
  let component: ModdingComponent;
  let fixture: ComponentFixture<ModdingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModdingComponent, FormatPipe, EndInPipe],
      imports: [
        RouterTestingModule,
        ClarityModule,
        BrowserAnimationsModule,
        FormsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModdingComponent);
    component = fixture.componentInstance;
    component.ms.start();
    component.res = component.ms.game.resourceManager.metalX1;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});

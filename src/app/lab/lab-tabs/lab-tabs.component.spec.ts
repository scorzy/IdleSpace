import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTabsComponent } from './lab-tabs.component';
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { defaultImport } from "src/app/app.component.spec";
import { ActionHeaderComponent } from "src/app/action/action-header/action-header.component";
import { FormatPipe } from "src/app/format.pipe";
import { MainService } from "src/app/main.service";
import { OptionsService } from "src/app/options.service";

describe('LabTabsComponent', () => {
  let component: LabTabsComponent;
  let fixture: ComponentFixture<LabTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: defaultImport(),
      declarations: [LabTabsComponent, ActionHeaderComponent, FormatPipe],
      providers: [MainService, OptionsService]
    }).compileComponents();
    
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

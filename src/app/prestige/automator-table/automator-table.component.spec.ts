import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatorTableComponent } from './automator-table.component';

describe('AutomatorTableComponent', () => {
  let component: AutomatorTableComponent;
  let fixture: ComponentFixture<AutomatorTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomatorTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomatorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabInfoComponent } from './lab-info.component';

describe('LabInfoComponent', () => {
  let component: LabInfoComponent;
  let fixture: ComponentFixture<LabInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

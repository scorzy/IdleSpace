import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormattedQuantityComponent } from './formatted-quantity.component';

describe('FormattedQuantityComponent', () => {
  let component: FormattedQuantityComponent;
  let fixture: ComponentFixture<FormattedQuantityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormattedQuantityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormattedQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

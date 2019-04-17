import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipyardInfoComponent } from './shipyard-info.component';

describe('ShipyardInfoComponent', () => {
  let component: ShipyardInfoComponent;
  let fixture: ComponentFixture<ShipyardInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipyardInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipyardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

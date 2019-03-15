import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattlefieldComponent } from './battlefield.component';

describe('BattlefieldComponent', () => {
  let component: BattlefieldComponent;
  let fixture: ComponentFixture<BattlefieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattlefieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattlefieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

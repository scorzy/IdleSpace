import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnemyCardComponent } from './enemy-card.component';

describe('EnemyCardComponent', () => {
  let component: EnemyCardComponent;
  let fixture: ComponentFixture<EnemyCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnemyCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnemyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

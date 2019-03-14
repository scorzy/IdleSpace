import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnemyViewComponent } from './enemy-view.component';

describe('EnemyViewComponent', () => {
  let component: EnemyViewComponent;
  let fixture: ComponentFixture<EnemyViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnemyViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnemyViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

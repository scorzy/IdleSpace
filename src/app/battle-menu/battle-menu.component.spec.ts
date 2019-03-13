import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BattleMenuComponent } from './battle-menu.component';

describe('BattleMenuComponent', () => {
  let component: BattleMenuComponent;
  let fixture: ComponentFixture<BattleMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BattleMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BattleMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

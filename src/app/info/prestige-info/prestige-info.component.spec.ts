import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestigeInfoComponent } from './prestige-info.component';

describe('PrestigeInfoComponent', () => {
  let component: PrestigeInfoComponent;
  let fixture: ComponentFixture<PrestigeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestigeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestigeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

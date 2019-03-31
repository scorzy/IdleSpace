import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestigeComponent } from './prestige.component';

describe('PrestigeComponent', () => {
  let component: PrestigeComponent;
  let fixture: ComponentFixture<PrestigeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrestigeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestigeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

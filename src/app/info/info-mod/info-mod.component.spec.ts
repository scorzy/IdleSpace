import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoModComponent } from './info-mod.component';

describe('InfoModComponent', () => {
  let component: InfoModComponent;
  let fixture: ComponentFixture<InfoModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfoModComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

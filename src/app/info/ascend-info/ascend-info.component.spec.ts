import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AscendInfoComponent } from './ascend-info.component';

describe('AscendInfoComponent', () => {
  let component: AscendInfoComponent;
  let fixture: ComponentFixture<AscendInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AscendInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AscendInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

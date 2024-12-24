import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldPoComponent } from './hold-po.component';

describe('HoldPoComponent', () => {
  let component: HoldPoComponent;
  let fixture: ComponentFixture<HoldPoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HoldPoComponent]
    });
    fixture = TestBed.createComponent(HoldPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

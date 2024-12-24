import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntransitPoComponent } from './intransit-po.component';

describe('IntransitPoComponent', () => {
  let component: IntransitPoComponent;
  let fixture: ComponentFixture<IntransitPoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IntransitPoComponent]
    });
    fixture = TestBed.createComponent(IntransitPoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

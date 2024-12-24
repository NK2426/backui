import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewLeavetypeComponent } from './view-leavetype.component';

describe('ViewLeavetypeComponent', () => {
  let component: ViewLeavetypeComponent;
  let fixture: ComponentFixture<ViewLeavetypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewLeavetypeComponent]
    });
    fixture = TestBed.createComponent(ViewLeavetypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

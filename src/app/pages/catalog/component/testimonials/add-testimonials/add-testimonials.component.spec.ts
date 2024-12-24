import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestimonialsComponent } from './add-testimonials.component';

describe('AddTestimonialsComponent', () => {
  let component: AddTestimonialsComponent;
  let fixture: ComponentFixture<AddTestimonialsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTestimonialsComponent]
    });
    fixture = TestBed.createComponent(AddTestimonialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

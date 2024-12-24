import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentRelatedComponent } from './payment-related.component';

describe('PaymentRelatedComponent', () => {
  let component: PaymentRelatedComponent;
  let fixture: ComponentFixture<PaymentRelatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentRelatedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

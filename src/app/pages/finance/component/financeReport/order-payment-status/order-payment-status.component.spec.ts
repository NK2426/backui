import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentStatusComponent } from './order-payment-status.component';

describe('OrderPaymentStatusComponent', () => {
  let component: OrderPaymentStatusComponent;
  let fixture: ComponentFixture<OrderPaymentStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderPaymentStatusComponent]
    });
    fixture = TestBed.createComponent(OrderPaymentStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderRelatedComponent } from './order-related.component';

describe('OrderRelatedComponent', () => {
  let component: OrderRelatedComponent;
  let fixture: ComponentFixture<OrderRelatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderRelatedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

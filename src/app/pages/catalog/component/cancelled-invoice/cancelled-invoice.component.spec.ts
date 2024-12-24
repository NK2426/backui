import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledInvoiceComponent } from './cancelled-invoice.component';

describe('CancelledInvoiceComponent', () => {
  let component: CancelledInvoiceComponent;
  let fixture: ComponentFixture<CancelledInvoiceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CancelledInvoiceComponent]
    });
    fixture = TestBed.createComponent(CancelledInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

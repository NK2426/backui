import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutwardInvoiceComponent } from './outward-invoice.component';

describe('OutwardInvoiceComponent', () => {
  let component: OutwardInvoiceComponent;
  let fixture: ComponentFixture<OutwardInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutwardInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutwardInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnInvoiceComponent } from './return-invoice.component';

describe('ReturnInvoiceComponent', () => {
  let component: ReturnInvoiceComponent;
  let fixture: ComponentFixture<ReturnInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

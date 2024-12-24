import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewShippedInvoiceComponent } from './view-shipped-invoice.component';

describe('ViewShippedInvoiceComponent', () => {
  let component: ViewShippedInvoiceComponent;
  let fixture: ComponentFixture<ViewShippedInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewShippedInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewShippedInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

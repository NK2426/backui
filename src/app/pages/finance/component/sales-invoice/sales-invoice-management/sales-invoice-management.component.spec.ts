import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesInvoiceManagementComponent } from './sales-invoice-management.component';

describe('SalesInvoiceManagementComponent', () => {
  let component: SalesInvoiceManagementComponent;
  let fixture: ComponentFixture<SalesInvoiceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesInvoiceManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesInvoiceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

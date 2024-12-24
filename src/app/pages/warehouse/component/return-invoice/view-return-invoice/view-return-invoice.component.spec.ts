import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewReturnInvoiceComponent } from './view-return-invoice.component';

describe('ViewReturnInvoiceComponent', () => {
  let component: ViewReturnInvoiceComponent;
  let fixture: ComponentFixture<ViewReturnInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewReturnInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewReturnInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInvoicesShippedComponent } from './all-invoices-shipped.component';

describe('AllInvoicesShippedComponent', () => {
  let component: AllInvoicesShippedComponent;
  let fixture: ComponentFixture<AllInvoicesShippedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllInvoicesShippedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllInvoicesShippedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

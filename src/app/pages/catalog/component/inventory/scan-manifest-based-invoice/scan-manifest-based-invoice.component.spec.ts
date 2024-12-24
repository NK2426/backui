import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScanManifestBasedInvoiceComponent } from './scan-manifest-based-invoice.component';

describe('ScanManifestBasedInvoiceComponent', () => {
  let component: ScanManifestBasedInvoiceComponent;
  let fixture: ComponentFixture<ScanManifestBasedInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScanManifestBasedInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScanManifestBasedInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

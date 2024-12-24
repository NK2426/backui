import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManifestInvoiceComponent } from './manifest-invoice.component';

describe('ManifestInvoiceComponent', () => {
  let component: ManifestInvoiceComponent;
  let fixture: ComponentFixture<ManifestInvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManifestInvoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManifestInvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

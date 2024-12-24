import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBarcodeComponent } from './view-barcode.component';

describe('ViewBarcodeComponent', () => {
  let component: ViewBarcodeComponent;
  let fixture: ComponentFixture<ViewBarcodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewBarcodeComponent]
    });
    fixture = TestBed.createComponent(ViewBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

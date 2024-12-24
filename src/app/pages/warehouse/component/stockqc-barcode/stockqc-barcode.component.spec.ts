import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockqcBarcodeComponent } from './stockqc-barcode.component';

describe('StockqcBarcodeComponent', () => {
  let component: StockqcBarcodeComponent;
  let fixture: ComponentFixture<StockqcBarcodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockqcBarcodeComponent]
    });
    fixture = TestBed.createComponent(StockqcBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

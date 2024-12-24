import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBarcodeComponent } from './list-barcode.component';

describe('ListBarcodeComponent', () => {
  let component: ListBarcodeComponent;
  let fixture: ComponentFixture<ListBarcodeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBarcodeComponent]
    });
    fixture = TestBed.createComponent(ListBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockbarcodeWebComponent } from './stockbarcode-web.component';

describe('StockbarcodeWebComponent', () => {
  let component: StockbarcodeWebComponent;
  let fixture: ComponentFixture<StockbarcodeWebComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockbarcodeWebComponent]
    });
    fixture = TestBed.createComponent(StockbarcodeWebComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DamageStockComponent } from './damage-stock.component';

describe('DamageStockComponent', () => {
  let component: DamageStockComponent;
  let fixture: ComponentFixture<DamageStockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DamageStockComponent]
    });
    fixture = TestBed.createComponent(DamageStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

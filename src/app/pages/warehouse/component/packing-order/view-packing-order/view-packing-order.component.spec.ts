import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPackingOrderComponent } from './view-packing-order.component';

describe('ViewPackingOrderComponent', () => {
  let component: ViewPackingOrderComponent;
  let fixture: ComponentFixture<ViewPackingOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPackingOrderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPackingOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

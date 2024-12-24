import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingOrderDetailComponent } from './packing-order-detail.component';

describe('PackingOrderDetailComponent', () => {
  let component: PackingOrderDetailComponent;
  let fixture: ComponentFixture<PackingOrderDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackingOrderDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackingOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

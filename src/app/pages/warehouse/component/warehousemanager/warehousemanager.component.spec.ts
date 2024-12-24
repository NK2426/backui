import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarehousemanagerComponent } from './warehousemanager.component';

describe('WarehousemanagerComponent', () => {
  let component: WarehousemanagerComponent;
  let fixture: ComponentFixture<WarehousemanagerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WarehousemanagerComponent]
    });
    fixture = TestBed.createComponent(WarehousemanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

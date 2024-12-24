import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShelfingComponent } from './shelfing.component';

describe('ShelfingComponent', () => {
  let component: ShelfingComponent;
  let fixture: ComponentFixture<ShelfingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShelfingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelfingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

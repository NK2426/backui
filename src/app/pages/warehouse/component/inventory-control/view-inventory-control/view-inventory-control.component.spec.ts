import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInventoryControlComponent } from './view-inventory-control.component';

describe('ViewInventoryControlComponent', () => {
  let component: ViewInventoryControlComponent;
  let fixture: ComponentFixture<ViewInventoryControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewInventoryControlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewInventoryControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

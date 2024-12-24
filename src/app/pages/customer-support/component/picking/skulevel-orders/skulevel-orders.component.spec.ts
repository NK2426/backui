import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkulevelOrdersComponent } from './skulevel-orders.component';

describe('CustomerOrdersComponent', () => {
  let component: SkulevelOrdersComponent;
  let fixture: ComponentFixture<SkulevelOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkulevelOrdersComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkulevelOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

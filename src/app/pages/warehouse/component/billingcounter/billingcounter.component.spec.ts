import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingcounterComponent } from './billingcounter.component';

describe('BillingcounterComponent', () => {
  let component: BillingcounterComponent;
  let fixture: ComponentFixture<BillingcounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillingcounterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingcounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

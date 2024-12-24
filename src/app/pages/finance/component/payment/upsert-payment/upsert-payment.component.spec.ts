import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertPaymentComponent } from './upsert-payment.component';

describe('UpsertPaymentComponent', () => {
  let component: UpsertPaymentComponent;
  let fixture: ComponentFixture<UpsertPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpsertPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

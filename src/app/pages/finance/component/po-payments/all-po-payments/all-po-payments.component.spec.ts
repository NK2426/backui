import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPoPaymentsComponent } from './all-po-payments.component';

describe('AllPoPaymentsComponent', () => {
  let component: AllPoPaymentsComponent;
  let fixture: ComponentFixture<AllPoPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPoPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllPoPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

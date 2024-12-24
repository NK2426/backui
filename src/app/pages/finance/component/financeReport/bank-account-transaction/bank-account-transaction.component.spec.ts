import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAccountTransactionComponent } from './bank-account-transaction.component';

describe('BankAccountTransactionComponent', () => {
  let component: BankAccountTransactionComponent;
  let fixture: ComponentFixture<BankAccountTransactionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BankAccountTransactionComponent]
    });
    fixture = TestBed.createComponent(BankAccountTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

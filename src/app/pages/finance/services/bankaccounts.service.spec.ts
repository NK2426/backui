import { TestBed } from '@angular/core/testing';

import { BankaccountsService } from './bankaccounts.service';

describe('BankaccountsService', () => {
  let service: BankaccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankaccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

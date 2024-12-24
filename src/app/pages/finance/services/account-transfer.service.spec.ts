import { TestBed } from '@angular/core/testing';

import { AccountTransferService } from './account-transfer.service';

describe('AccountTransferService', () => {
  let service: AccountTransferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountTransferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

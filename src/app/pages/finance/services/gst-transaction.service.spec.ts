import { TestBed } from '@angular/core/testing';

import { GstTransactionService } from './gst-transaction.service';

describe('GstTransactionService', () => {
  let service: GstTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GstTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

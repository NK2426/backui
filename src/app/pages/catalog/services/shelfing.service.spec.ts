import { TestBed } from '@angular/core/testing';

import { ShelfingService } from './shelfing.service';

describe('ShelfingService', () => {
  let service: ShelfingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShelfingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

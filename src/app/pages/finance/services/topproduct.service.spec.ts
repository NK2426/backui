import { TestBed } from '@angular/core/testing';

import { TopproductService } from './topproduct.service';

describe('TopproductService', () => {
  let service: TopproductService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopproductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

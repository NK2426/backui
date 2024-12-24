import { TestBed } from '@angular/core/testing';

import { ProductvariantsService } from './productvariants.service';

describe('ProductvariantsService', () => {
  let service: ProductvariantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductvariantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

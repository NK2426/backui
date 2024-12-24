import { TestBed } from '@angular/core/testing';

import { SupersaleService } from './supersale.service';

describe('SupersaleService', () => {
  let service: SupersaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SupersaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

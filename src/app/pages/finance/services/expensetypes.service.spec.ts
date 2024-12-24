import { TestBed } from '@angular/core/testing';

import { ExpensetypesService } from './expensetypes.service';

describe('ExpensetypesService', () => {
  let service: ExpensetypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpensetypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { WebteamService } from './webteam.service';

describe('WebteamService', () => {
  let service: WebteamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebteamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

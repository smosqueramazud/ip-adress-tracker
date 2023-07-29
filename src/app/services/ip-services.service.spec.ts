import { TestBed } from '@angular/core/testing';

import { IpServicesService } from './ip-services.service';

describe('IpServicesService', () => {
  let service: IpServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IpServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

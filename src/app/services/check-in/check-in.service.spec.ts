import { TestBed, inject } from '@angular/core/testing';

import { CheckInService } from './check-in.service';

describe('CheckInService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckInService]
    });
  });

  it('should be created', inject([CheckInService], (service: CheckInService) => {
    expect(service).toBeTruthy();
  }));
});

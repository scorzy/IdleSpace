import { TestBed } from '@angular/core/testing';

import { BattleService } from './battle.service';

describe('BattleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BattleService = TestBed.get(BattleService);
    expect(service).toBeTruthy();
  });
});

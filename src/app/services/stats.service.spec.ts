import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { CONFIGS } from '../config/config.dev';
import { StatsService } from './stats.service';

describe('StatsService', () => {
  let service: StatsService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(StatsService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('requests a network from the back end', () => {
    let modularity: number | undefined;
    service.getNetwork('endorsements').subscribe(network => modularity = network.modularity);
    http.expectOne(`${CONFIGS.host}:${CONFIGS.port}/stats/endorsements/`).flush({
      users: {}, positions: {}, usernames: {}, colors: {}, modularity: 0.5,
    });
    expect(modularity).toBe(0.5);
  });
});

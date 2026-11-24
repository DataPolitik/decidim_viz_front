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

  describe('process periods', () => {
    const url = `${CONFIGS.host}:${CONFIGS.port}/stats/processes?lang=${CONFIGS.defaultLanguage}`;

    it('reads the processes with their days as local dates', () => {
      let periods: any[] = [];
      service.getProcessPeriods().subscribe(p => periods = p);
      http.expectOne(url).flush({ processes: [
        { id: 1, title: 'Redesign', start_date: '2021-11-04', end_date: '2022-12-31', url: null },
        { id: 2, title: 'News', start_date: '2022-10-06', end_date: null, url: null },
      ] });
      expect(periods).toEqual([
        { title: 'Redesign', start: new Date(2021, 10, 4), end: new Date(2022, 11, 31) },
        { title: 'News', start: new Date(2022, 9, 6), end: null },
      ]);
    });

    it('asks the back end only once', () => {
      service.getProcessPeriods().subscribe();
      service.getProcessPeriods().subscribe();
      http.expectOne(url).flush({ processes: [] });
    });

    it('gives no processes when the back end has no such endpoint', () => {
      let periods: any[] | undefined;
      service.getProcessPeriods().subscribe(p => periods = p);
      http.expectOne(url).flush('Not found', { status: 404, statusText: 'Not Found' });
      expect(periods).toEqual([]);
    });
  });
});

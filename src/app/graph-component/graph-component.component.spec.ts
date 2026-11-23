import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { StatsService } from '../services/stats.service';
import { GraphComponentComponent } from './graph-component.component';

describe('GraphComponentComponent', () => {
  let fixture: ComponentFixture<GraphComponentComponent>;
  let getNetwork: jasmine.Spy;

  const network = {
    users: { '1': { '2': 0.5 }, '2': { '1': 0.5 }, '3': {} },
    positions: { '1': [0, 0], '2': [1, 1], '3': [2, 2] },
    usernames: {},
    colors: { '1': [1, 2, 3], '2': [1, 2, 3], '3': [4, 5, 6] },
  };

  function create(kind: string) {
    TestBed.configureTestingModule({
      declarations: [GraphComponentComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: StatsService, useValue: { getNetwork } }],
      schemas: [NO_ERRORS_SCHEMA],  // plotly-plot
    });
    fixture = TestBed.createComponent(GraphComponentComponent);
    fixture.componentInstance.graphToCall = kind;
    fixture.componentInstance.graphTitle = 'support network';
    fixture.detectChanges();
  }

  it('loads the requested network and builds its figure', () => {
    getNetwork = jasmine.createSpy('getNetwork').and.returnValue(of(network));
    create('endorsements');
    expect(getNetwork).toHaveBeenCalledWith('endorsements');
    const figure = fixture.componentInstance.figure!;
    expect(figure.nodeCount).toBe(2);
    expect(figure.isolatedCount).toBe(1);
    expect(fixture.nativeElement.querySelector('plotly-plot')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.graph_note')).not.toBeNull();  // isolated users note
  });

  it('reports a failed load', () => {
    getNetwork = jasmine.createSpy('getNetwork').and.returnValue(throwError(() => new Error('404')));
    create('comments');
    expect(fixture.componentInstance.failed).toBeTrue();
    expect(fixture.nativeElement.querySelector('plotly-plot')).toBeNull();
  });
});

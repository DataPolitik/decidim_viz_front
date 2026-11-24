import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SHALLOW } from '../../testing/test-setup';

import { ActivitiesHistogramComponent, fillMissingDays, parseKey } from './activities-histograms.component';

describe('ActivitiesComponent', () => {
  let component: ActivitiesHistogramComponent;
  let fixture: ComponentFixture<ActivitiesHistogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitiesHistogramComponent ],
      imports: [ TranslateModule.forRoot() ],
      schemas: SHALLOW
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitiesHistogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('ActivitiesHistogramComponent data', () => {
  const day = (y: number, m: number, d: number) => new Date(y, m - 1, d);

  it('reads both day formats', () => {
    expect(parseKey('15/10/2026')).toEqual(day(2026, 10, 15));
    expect(parseKey('2026-10-15')).toEqual(day(2026, 10, 15));
    expect(parseKey('October 15')).toBeNull();
  });

  it('fills quiet days with 0 for daily counts', () => {
    const filled = fillMissingDays([{ date: day(2024, 1, 30), value: 2 }, { date: day(2024, 2, 2), value: 5 }], false);
    expect(filled.map(p => [p.date.getDate(), p.value])).toEqual([[30, 2], [31, 0], [1, 0], [2, 5]]);
  });

  it('keeps the previous total on quiet days for cumulative counts', () => {
    const filled = fillMissingDays([{ date: day(2024, 1, 1), value: 3 }, { date: day(2024, 1, 4), value: 7 }], true);
    expect(filled.map(p => p.value)).toEqual([3, 3, 3, 7]);
  });

  it('marks the start and end of the processes inside the charted period', () => {
    const component = new ActivitiesHistogramComponent({ nativeElement: document.createElement('div') } as any);
    component.response = [{ key: '01/01/2024', value: 1 }, { key: '31/12/2024', value: 2 }];
    component.processes = [
      { title: 'Inside', start: day(2024, 3, 1), end: day(2024, 6, 30) },
      { title: 'Starts before', start: day(2023, 6, 1), end: day(2024, 2, 1) },
      { title: 'Open-ended', start: day(2024, 9, 1), end: null },
      { title: 'Later', start: day(2025, 1, 1), end: null },
    ];
    component.ngOnChanges();
    const lines = (component.options as any).axes.find((a: any) => a.type === 'time').crossLines;
    expect(lines.length).toBe(4);  // Inside x2, Starts before (end), Open-ended (start)
    expect(component.processLines.map(l => [l.title, l.kind, l.day])).toEqual([
      ['Inside', 'start', '01/03/2024'], ['Inside', 'end', '30/06/2024'],
      ['Starts before', 'end', '01/02/2024'], ['Open-ended', 'start', '01/09/2024'],
    ]);
  });

  it('does not rebuild the chart for a copy of the same data', () => {
    // Regression: the pages pass a new array at every change detection, and
    // rebuilding each time looped with the placement of the hover strips.
    const component = new ActivitiesHistogramComponent({ nativeElement: document.createElement('div') } as any);
    component.response = [{ key: '01/01/2024', value: 1 }];
    component.ngOnChanges();
    const first = component.options;
    component.response = [{ key: '01/01/2024', value: 1 }];
    component.ngOnChanges();
    expect(component.options).toBe(first);
  });
});

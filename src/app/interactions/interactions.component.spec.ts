import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NEVER, Observable, of } from 'rxjs';

import { StatsService } from '../services/stats.service';
import { InteractionsComponent } from './interactions.component';

describe('InteractionsComponent', () => {
  let component: InteractionsComponent;
  let fixture: ComponentFixture<InteractionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('InteractionsComponent legend ratios', () => {
  let component: InteractionsComponent;

  // Builds the component directly: the ratios only depend on the colors response.
  function load(sizes: { [color: string]: number }) {
    const users: { [color: string]: number[] } = {};
    let total = 0;
    for (const color of Object.keys(sizes)) {
      users[color] = Array.from({ length: sizes[color] }, (_, i) => total + i);
      total += sizes[color];
    }
    (component as any).processResponse({ total, colors: { users, proposals: {} } });
  }

  beforeEach(() => {
    const subMenu = jasmine.createSpyObj('SubMenuService', ['setEntries']);
    component = new InteractionsComponent({} as any, subMenu);
  });

  it('counts the users of the communities without their own legend entry', () => {
    // 1000 users: two large communities and three below the 0.5% threshold.
    load({ '#aaaaaa': 600, '#bbbbbb': 390, '#cccccc': 4, '#dddddd': 3, '#eeeeee': 3 });
    expect(component.othersRatio).toBeCloseTo(0.01, 10);
  });

  it('adds up to 1 with the listed communities', () => {
    load({ '#aaaaaa': 500, '#bbbbbb': 300, '#cccccc': 197, '#dddddd': 2, '#eeeeee': 1 });
    const listed = component.colorsNodesSortedList
      .filter((community) => component.isMinimumRatio(community.key))
      .reduce((sum, community) => sum + component.getRatioOfCommunity(community.key), 0);
    expect(listed + component.othersRatio).toBeCloseTo(1, 10);
  });

  it('is 0 when every community is listed', () => {
    load({ '#aaaaaa': 60, '#bbbbbb': 40 });
    expect(component.othersRatio).toBe(0);
  });

  it('is 0 for an empty network', () => {
    load({});
    expect(component.othersRatio).toBe(0);
  });
});

describe('InteractionsComponent modularity line', () => {
  const emptyColors = of({ total: 0, colors: { users: {}, proposals: {} } });

  function render(comments: Observable<{ modularity: number }>,
                  endorsements: Observable<{ modularity: number }>,
                  tab: 'comments' | 'endorsements'): HTMLElement {
    TestBed.configureTestingModule({
      declarations: [InteractionsComponent],
      imports: [TranslateModule.forRoot()],
      providers: [{
        provide: StatsService,
        useValue: {
          getCommentsColors: () => emptyColors,
          getEndorsesColors: () => emptyColors,
          getCommentsModularityValue: () => comments,
          getEndorsementsModularityValue: () => endorsements,
        },
      }],
      schemas: [NO_ERRORS_SCHEMA],  // app-graph-component, p-card
    });
    const fixture = TestBed.createComponent(InteractionsComponent);
    fixture.componentInstance.currentElement = tab;
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  function modularityText(element: HTMLElement): string | undefined {
    return element.querySelector('#modularity_explanation')?.textContent?.trim();
  }

  it('shows the endorsements modularity without waiting for the comments one', () => {
    // Regression: the endorsements line was guarded by modularityCommentsValue.
    const element = render(NEVER, of({ modularity: 0.42 }), 'endorsements');
    expect(modularityText(element)).toContain('0.42');
  });

  it('shows the comments modularity', () => {
    const element = render(of({ modularity: 0.31 }), NEVER, 'comments');
    expect(modularityText(element)).toContain('0.31');
  });

  it('shows a modularity of 0', () => {
    const element = render(of({ modularity: 0 }), NEVER, 'comments');
    expect(modularityText(element)).toContain('0.00');
  });

  it('hides the line until the value has loaded', () => {
    const element = render(NEVER, NEVER, 'endorsements');
    expect(modularityText(element)).toBeUndefined();
  });
});

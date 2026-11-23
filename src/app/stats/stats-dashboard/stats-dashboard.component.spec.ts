import { ComponentFixture, TestBed } from '@angular/core/testing';
import { appTestingImports, SHALLOW } from '../../testing/test-setup';

import { StatsDashboardComponent } from './stats-dashboard.component';

describe('StatsDashboardComponent', () => {
  let component: StatsDashboardComponent<unknown>;
  let fixture: ComponentFixture<StatsDashboardComponent<unknown>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsDashboardComponent ],
      imports: appTestingImports(),
      schemas: SHALLOW
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsDashboardComponent);
    component = fixture.componentInstance;
    component.title = 'stats.comments_per_user';  // required: the app always passes a translation key
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('shows the Gini value when given one', () => {
    component.data = [{ name: 'Ana', comments: 3 }, { name: 'Bob', comments: 1 }];
    component.titleColumn = 'name';
    component.countColumn = 'comments';
    component.gini = { value: 0.25, contributions: [0.1875, 0.0625] };
    component.gini_title = 'stats.inequality';
    fixture.detectChanges();
    const gini = (fixture.nativeElement as HTMLElement).querySelector('.demographic_table--gini');
    expect(gini?.textContent).toContain('0.250');
  });

  it('labels bars by rank and shows the name on hover', () => {
    component.isProposal = false;
    component.titleColumn = 'position';
    component.nameColumn = 'label';
    const tooltip = (component as any).toolTipRenderer({ xValue: 10, yValue: 108, datum: { position: 10, label: 'Unnamed participant #178' } });
    expect(tooltip.title).toBe('Unnamed participant #178');
  });

  it('keeps the bar label as tooltip title without a name column', () => {
    component.isProposal = false;
    component.titleColumn = 'name_en';
    const tooltip = (component as any).toolTipRenderer({ xValue: 'Climate', yValue: 3, datum: { name_en: 'Climate' } });
    expect(tooltip.title).toBe('Climate');
  });
});

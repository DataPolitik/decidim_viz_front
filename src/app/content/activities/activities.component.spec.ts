import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { ApolloTestingController } from 'apollo-angular/testing';

import { appTestingImports, SHALLOW } from '../../testing/test-setup';
import { ActivitiesComponent } from './activities.component';

describe('ActivitiesComponent summary', () => {
  let fixture: ComponentFixture<ActivitiesComponent>;
  let http: HttpTestingController;
  let apollo: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActivitiesComponent],
      imports: appTestingImports(),
      schemas: SHALLOW,
    }).compileComponents();
    fixture = TestBed.createComponent(ActivitiesComponent);
    http = TestBed.inject(HttpTestingController);
    apollo = TestBed.inject(ApolloTestingController);
    fixture.detectChanges();
  });

  const text = (id: string) =>
    (fixture.nativeElement as HTMLElement).querySelector('#' + id)?.textContent?.replace(/\s+/g, ' ').trim();
  const notAvailable = () =>
    (fixture.nativeElement as HTMLElement).querySelectorAll('#summary .not_available').length;
  const summaryRequest = () => http.expectOne(request => request.url.endsWith('/stats/summary'));
  const languagesRequest = () => http.expectOne(request => request.url.endsWith('/stats/languages/'));
  const processesQuery = () => apollo.expectOne('getParticipatoryProcessesTotal');

  it('shows the counts from the back end and the Decidim API', async () => {
    summaryRequest().flush({ participants: 320, proposals: 2350, comments: 4208 });
    languagesRequest().flush(['ca', 'en', 'es']);
    processesQuery().flush({ data: { participatoryProcesses: [{ id: '1' }, { id: '2' }] } });
    await fixture.whenStable();  // Apollo delivers results asynchronously
    fixture.detectChanges();

    expect(text('summary_participants')).toContain('320');
    expect(text('summary_proposals')).toContain('2350');
    expect(text('summary_processes')).toContain('2');
    expect(text('summary_comments')).toContain('4208');
    expect(notAvailable()).toBe(0);
  });

  it('shows "not available" instead of loading forever when a request fails', async () => {
    // Regression: the counts came from GraphQL `metrics`, which newer Decidim removed,
    // and a failure left "Loading data..." on screen.
    summaryRequest().flush('error', { status: 500, statusText: 'Server Error' });
    processesQuery().networkError(new Error('no such instance'));
    await new Promise(resolve => setTimeout(resolve));  // Apollo reports the error on a later tick
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.componentInstance.summaryFailed).withContext('summaryFailed').toBeTrue();
    expect(fixture.componentInstance.participatoryProcessesFailed).withContext('processesFailed').toBeTrue();
    expect(fixture.componentInstance.participatoryProcessesCount).withContext('processesCount').toBeUndefined();
    expect(text('summary_participants')).toBeUndefined();
    expect(notAvailable()).toBe(4);  // participants, proposals, processes, comments
  });
});

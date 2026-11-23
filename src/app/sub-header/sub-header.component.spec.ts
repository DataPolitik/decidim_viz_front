import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';

import { CONFIGS } from '../config/config.dev';
import { appTestingImports, SHALLOW } from '../testing/test-setup';
import { SubHeaderComponent } from './sub-header.component';

describe('SubHeaderComponent', () => {
  let component: SubHeaderComponent;
  let fixture: ComponentFixture<SubHeaderComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubHeaderComponent ],
      imports: appTestingImports(),
      schemas: SHALLOW,
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubHeaderComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  const instanceRequest = () => http.expectOne(request => request.url.endsWith('/stats/instance'));
  const dataSource = () => (fixture.nativeElement as HTMLElement).querySelector('#data_source');

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows the instance the back end reports, with a link', () => {
    instanceRequest().flush({ name: 'meta.decidim.org', url: 'https://meta.decidim.org', hosts: [] });
    fixture.detectChanges();
    expect(dataSource()?.textContent).toContain('meta.decidim.org');
    expect(dataSource()?.querySelector('a')?.getAttribute('href')).toBe('https://meta.decidim.org');
  });

  it('falls back to the configured instance when the back end cannot tell', () => {
    instanceRequest().flush('error', { status: 500, statusText: 'Server Error' });
    fixture.detectChanges();
    expect(dataSource()?.textContent).toContain(CONFIGS.instanceName);
  });

  it('shows nothing without any instance name', () => {
    const configured = CONFIGS.instanceName;
    CONFIGS.instanceName = '';
    try {
      instanceRequest().flush({ name: null, url: null, hosts: [] });
      fixture.detectChanges();
      expect(dataSource()).toBeNull();
    } finally {
      CONFIGS.instanceName = configured;
    }
  });
});

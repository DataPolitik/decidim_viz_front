import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { appTestingImports, SHALLOW } from './testing/test-setup';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // AppComponent creates the named GraphQL clients itself.
      imports: appTestingImports([]),
      declarations: [
        AppComponent
      ],
      schemas: SHALLOW,
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'decidim_viz_front'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('decidim_viz_front');
  });

  it('should render the header and the routed content', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#logo')?.textContent).toContain('Decidim.Viz');
    expect(compiled.querySelector('app-navigation-menu')).not.toBeNull();
    expect(compiled.querySelector('#content router-outlet')).not.toBeNull();
  });
});

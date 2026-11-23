import { ComponentFixture, TestBed } from '@angular/core/testing';
import { appTestingImports, SHALLOW } from '../../testing/test-setup';

import { ProposalsViewerComponent } from './proposals-viewer.component';

describe('ProposalsViewerComponent', () => {
  let component: ProposalsViewerComponent;
  let fixture: ComponentFixture<ProposalsViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalsViewerComponent ],
      imports: appTestingImports(),
      schemas: SHALLOW
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

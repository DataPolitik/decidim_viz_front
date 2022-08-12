import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposalsViewerComponent } from './proposals-viewer.component';

describe('ProposalsViewerComponent', () => {
  let component: ProposalsViewerComponent;
  let fixture: ComponentFixture<ProposalsViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalsViewerComponent ]
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

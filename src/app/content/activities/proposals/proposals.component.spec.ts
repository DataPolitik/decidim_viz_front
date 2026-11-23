import { ComponentFixture, TestBed } from '@angular/core/testing';
import { appTestingImports, SHALLOW } from '../../../testing/test-setup';

import { ProposalsComponent } from './proposals.component';

describe('ProposalsComponent', () => {
  let component: ProposalsComponent;
  let fixture: ComponentFixture<ProposalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProposalsComponent ],
      imports: appTestingImports(),
      schemas: SHALLOW
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProposalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

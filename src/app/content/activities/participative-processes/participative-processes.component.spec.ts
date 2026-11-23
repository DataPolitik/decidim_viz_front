import { ComponentFixture, TestBed } from '@angular/core/testing';
import { appTestingImports, SHALLOW } from '../../../testing/test-setup';

import { ParticipativeProcessesComponent } from './participative-processes.component';

describe('ParticipativeProcessesComponent', () => {
  let component: ParticipativeProcessesComponent;
  let fixture: ComponentFixture<ParticipativeProcessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipativeProcessesComponent ],
      imports: appTestingImports(),
      schemas: SHALLOW
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParticipativeProcessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

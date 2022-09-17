import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipativeProcessesComponent } from './participative-processes.component';

describe('ParticipativeProcessesComponent', () => {
  let component: ParticipativeProcessesComponent;
  let fixture: ComponentFixture<ParticipativeProcessesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParticipativeProcessesComponent ]
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

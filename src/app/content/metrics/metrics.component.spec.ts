import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteraccionesComponent } from './metrics.component';

describe('InteraccionesComponent', () => {
  let component: InteraccionesComponent;
  let fixture: ComponentFixture<InteraccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteraccionesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteraccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

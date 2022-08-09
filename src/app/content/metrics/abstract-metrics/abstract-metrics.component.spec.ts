import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractMetricsComponent } from './abstract-metrics.component';

describe('AbstractMetricsComponent', () => {
  let component: AbstractMetricsComponent;
  let fixture: ComponentFixture<AbstractMetricsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbstractMetricsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

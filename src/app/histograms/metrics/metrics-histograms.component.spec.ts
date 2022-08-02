import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsHistogramComponent } from './metrics-histograms.component';

describe('MetricsComponent', () => {
  let component: MetricsHistogramComponent;
  let fixture: ComponentFixture<MetricsHistogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetricsHistogramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricsHistogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

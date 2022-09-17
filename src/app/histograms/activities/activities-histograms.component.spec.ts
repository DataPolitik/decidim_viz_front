import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivitiesHistogramComponent } from './activities-histograms.component';

describe('ActivitiesComponent', () => {
  let component: ActivitiesHistogramComponent;
  let fixture: ComponentFixture<ActivitiesHistogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivitiesHistogramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivitiesHistogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

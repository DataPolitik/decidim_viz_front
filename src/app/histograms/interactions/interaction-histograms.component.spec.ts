import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionHistogramComponent } from './interaction-histograms.component';

describe('HistogramsComponent', () => {
  let component: InteractionHistogramComponent;
  let fixture: ComponentFixture<InteractionHistogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractionHistogramComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InteractionHistogramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

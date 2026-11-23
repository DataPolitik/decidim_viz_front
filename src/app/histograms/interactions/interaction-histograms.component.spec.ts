import { ComponentFixture, TestBed } from '@angular/core/testing';
import { appTestingImports, SHALLOW } from '../../testing/test-setup';

import { InteractionHistogramComponent } from './interaction-histograms.component';

describe('HistogramsComponent', () => {
  let component: InteractionHistogramComponent;
  let fixture: ComponentFixture<InteractionHistogramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InteractionHistogramComponent ],
      imports: appTestingImports(),
      schemas: SHALLOW
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

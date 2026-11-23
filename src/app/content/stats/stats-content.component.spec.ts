import { ComponentFixture, TestBed } from '@angular/core/testing';
import { appTestingImports, SHALLOW } from '../../testing/test-setup';

import { StatsContentComponent } from './stats-content.component';

describe('StatsComponent', () => {
  let component: StatsContentComponent;
  let fixture: ComponentFixture<StatsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatsContentComponent ],
      imports: appTestingImports(),
      schemas: SHALLOW
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

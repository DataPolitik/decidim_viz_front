import { ComponentFixture, TestBed } from '@angular/core/testing';
import { appTestingImports, SHALLOW } from '../testing/test-setup';

import { StillLoadingComponent } from './still-loading.component';

describe('StillLoadingComponent', () => {
  let component: StillLoadingComponent;
  let fixture: ComponentFixture<StillLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StillLoadingComponent ],
      imports: appTestingImports(),
      schemas: SHALLOW
    })
    .compileComponents();

    fixture = TestBed.createComponent(StillLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

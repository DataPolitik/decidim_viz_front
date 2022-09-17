import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbstractActivitiesComponent } from './abstract-activities.component';

describe('AbstractActivitiesComponent', () => {
  let component: AbstractActivitiesComponent;
  let fixture: ComponentFixture<AbstractActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbstractActivitiesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AbstractActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

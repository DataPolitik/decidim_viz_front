import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemografiaComponent } from './demografia.component';

describe('DemografiaComponent', () => {
  let component: DemografiaComponent;
  let fixture: ComponentFixture<DemografiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DemografiaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DemografiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

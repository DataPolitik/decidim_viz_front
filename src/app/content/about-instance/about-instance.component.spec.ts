import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutInstanceComponent } from './about-instance.component';

describe('AboutInstanceComponent', () => {
  let component: AboutInstanceComponent;
  let fixture: ComponentFixture<AboutInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AboutInstanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

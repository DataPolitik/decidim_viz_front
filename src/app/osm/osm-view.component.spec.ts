import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsmViewComponent } from './osm-view.component';

describe('OsmViewComponent', () => {
  let component: OsmViewComponent;
  let fixture: ComponentFixture<OsmViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OsmViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OsmViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

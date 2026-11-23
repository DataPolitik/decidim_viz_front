import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Proposal } from '../models/proposal.model';
import { MapsComponent, proposalCoordinates } from './maps.component';

describe('MapsComponent', () => {
  let component: MapsComponent;
  let fixture: ComponentFixture<MapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe('proposalCoordinates', () => {
  const at = (latitude: string | null, longitude: string | null) =>
    ({ id: 1, latitude, longitude } as Proposal);

  it('gives [longitude, latitude], the order OpenLayers expects', () => {
    expect(proposalCoordinates(at('41.4036', '2.1744'))).toEqual([2.1744, 41.4036]);
  });

  it('is null without a usable location', () => {
    expect(proposalCoordinates(at(null, null))).toBeNull();
    expect(proposalCoordinates(at('', ''))).toBeNull();
    expect(proposalCoordinates(at('41.4', null))).toBeNull();
    expect(proposalCoordinates(at('north', '2.1'))).toBeNull();
    expect(proposalCoordinates(at('91', '2.1'))).toBeNull();
    expect(proposalCoordinates(at('41.4', '181'))).toBeNull();
  });
});

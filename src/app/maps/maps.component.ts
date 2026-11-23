import { AfterViewInit, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import { Feature, Overlay } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat, transform } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import XyzSource from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import {Circle, Fill, Icon, Style} from 'ol/style';
import { Proposal } from '../models/proposal.model';
import { MAP_CONFIG } from '../config/map';

/**
 * A proposal's location as [longitude, latitude] (the order OpenLayers uses),
 * or null when it has none: no coordinates, empty or unparseable text, or
 * values outside the valid range.
 */
export function proposalCoordinates(proposal: Proposal): [number, number] | null {
  const latitude = parseFloat(proposal.latitude ?? '');
  const longitude = parseFloat(proposal.longitude ?? '');
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)
      || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    return null;
  }
  return [longitude, latitude];
}

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements AfterViewInit, OnChanges, OnDestroy {
  /** Proposals to mark; those without a location are skipped. */
  @Input() proposals: Proposal[] = [];

  map!: Map;
  vectorSource = new VectorSource({ features: [] });
  vectorLayer!: any;
  xyzSource!: XyzSource;
  tileLayer: any;
  view!: View;
  marker!: Feature;

  private greenStyle = new Style({
    image: new Circle({
      radius: 7,
      fill: new Fill({
        color: 'green'
      })
    })
  });

  private iconStyle = new Style({
    image: new Icon({
      anchor: [0.5, 46],
      scale: 0.5,
      anchorXUnits: 'fraction',
      anchorYUnits: 'pixels',
      src: 'assets/marker.png',
    }),
  });

  private container!: HTMLElement | null;
  private content!: HTMLElement | null;
  private closer!: HTMLElement | null;
  private overlay!: Overlay;


  constructor(){
    this.closePopUp = this.closePopUp.bind(this);
    this.closerClick = this.closerClick.bind(this);
    this.closePopUp = this.closePopUp.bind(this);
  }

  private generateFeature(longitude: number, latitude: number, name: string): Feature{
    return new Feature({
      // OpenLayers takes coordinates as [longitude, latitude].
      geometry: new Point(fromLonLat([longitude, latitude])),
      name: name,
      population: 4000,
      rainfall: 500,

    });
  }

  /** Adds the proposal to the map; returns false (and adds nothing) when it has no valid location. */
  public addMarker(proposalToAdd: Proposal, showIcon = true): boolean{
    const coordinates = proposalCoordinates(proposalToAdd);
    if (!coordinates){
      return false;
    }
    const [longitude, latitude] = coordinates;
    const name = proposalToAdd.id.toString();

    const newMarker = this.generateFeature(longitude, latitude, name);
    if(showIcon){
      newMarker.setStyle(this.iconStyle);
    }else{
      newMarker.setStyle(this.greenStyle);
    }

    newMarker.setProperties(
      {
        'idProposal':proposalToAdd.id,
        'title': proposalToAdd.title_en ?? proposalToAdd.title_es ?? proposalToAdd.title ?? '',
        'url':proposalToAdd.url
      }
    )
    this.vectorSource.addFeature(newMarker);
    return true;
  }

  ngOnChanges() {
    this.showProposals();
  }

  ngOnDestroy() {
    this.map?.setTarget(undefined);
  }

  private showProposals() {
    this.vectorSource.clear();
    this.proposals.forEach(proposal => this.addMarker(proposal));
  }

  // Built once the template's elements (#map, #popup) exist.
  ngAfterViewInit() {

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    // XYZ
    this.xyzSource = new XyzSource({
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
    });

    this.tileLayer = new TileLayer({
      source: this.xyzSource
    });

    // View and map
    this.view = new View({
      center: fromLonLat([MAP_CONFIG.center_longitude, MAP_CONFIG.center_latitude]),
      zoom: MAP_CONFIG.center_zoom
    });

    this.map = new Map({
      target: 'map',
      layers: [this.tileLayer, this.vectorLayer],
      view: this.view
    });



    this.container = document.getElementById('popup') as HTMLElement;
    this.content = document.getElementById('popup-content') as HTMLElement;
    this.closer = document.getElementById('popup-closer') as HTMLElement;

    this.overlay = new Overlay({
      element: this.container,
      autoPan: true,
      autoPanAnimation: {
          duration: 250
        }
    });
    this.map.addOverlay(this.overlay);


    this.closer.onclick = this.closerClick;
    this.map.on('pointermove', this.closePopUp);
  }


  private closerClick(){
      this.overlay.setPosition(undefined);
      if (this.closer)
        this.closer.blur();
      return false;
  }

  private closePopUp(event: any){
    if (this.map.hasFeatureAtPixel(event.pixel) === true && this.content) {
      var coordinate = event.coordinate;
      const features =this.map.getFeaturesAtPixel(event.pixel);
      if (features.length > 0){
        const feature = features[0];
        // Titles are participants' text: insert them as text, never as HTML.
        const bold = document.createElement('b');
        bold.textContent = feature.get('title');
        this.content.replaceChildren(bold);
        this.overlay.setPosition(coordinate);
      }


  } else {
    this.overlay.setPosition(undefined);
    if(this.closer)
      this.closer.blur();
  }
  }
}


function Proposal(latitude: number, longitude: number, name: string, proposal: any, Proposal: any) {
  throw new Error('Function not implemented.');
}


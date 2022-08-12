import { Component, OnInit } from '@angular/core';
import 'ol/ol.css';
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



@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit {
  map!: Map;
  vectorSource!: VectorSource;
  vectorLayer!: any;
  xyzSource!: XyzSource;
  tileLayer: any;
  view!: View;
  marker!: Feature;

  private styleGreen = new Style({
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

  private generateFeature(latitude: number, longitude: number, name: string): Feature{
    return new Feature({
      geometry: new Point([latitude, longitude]),
      name: name,
      population: 4000,
      rainfall: 500,

    });
  }

  public addMarker(latitude: number, longitude: number, name: string, proposalToAdd: Proposal){
    const newMarker = this.generateFeature(latitude, longitude, name);
    newMarker.setStyle(this.styleGreen);
    newMarker.setProperties(
      {
        'idProposal':proposalToAdd.id,
        'title_es':proposalToAdd.title_es,
        'url':proposalToAdd.url
      }
    )
    this.vectorSource.addFeature(newMarker);
  }

  ngOnInit() {

    this.vectorSource = new VectorSource({
      features: []
    });

    this.vectorLayer = new VectorLayer({
      source: this.vectorSource
    });

    // XYZ
    this.xyzSource = new XyzSource({
      url: 'http://tile.osm.org/{z}/{x}/{y}.png'
    });

    this.tileLayer = new TileLayer({
      source: this.xyzSource
    });

    // View and map
    this.view = new View({
      center: fromLonLat([40,0]),
      zoom: 4
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
        const title = feature.get('title_es');
        const url = feature.get('url');
        const htmlText = '<b>${title}</b><br /><a href="${url}" title=${title}>Ver en instancia</a>';
        this.content.innerHTML = htmlText;
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


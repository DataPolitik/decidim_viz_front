import { Component, OnInit } from '@angular/core';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import { OSM } from 'ol/source';
import TileLayer from 'ol/layer/Tile';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import XyzSource from 'ol/source/XYZ';
import VectorSource from 'ol/source/Vector';
import {Icon, Style} from 'ol/style';

const iconFeature = new Feature({
  geometry: new Point([37.46164, 53.902257]),
  name: 'Null Island',
  population: 4000,
  rainfall: 500,
});

const iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 46],
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: '/assets/marker.png',
  }),
});

iconFeature.setStyle(iconStyle);

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

  ngOnInit() {

    // Feature and vector
    this.marker = new Feature({
      geometry: new Point(fromLonLat([37.46164, 53.902257]))
    });

    this.vectorSource = new VectorSource({
      features: [iconFeature]
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
      center: fromLonLat([37.56164, 53.902257]),
      zoom: 14
    });

    this.map = new Map({
      target: 'map',
      layers: [this.tileLayer, this.vectorLayer],
      view: this.view
    });
  }

}

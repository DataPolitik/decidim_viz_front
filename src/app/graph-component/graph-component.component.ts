import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { GraphResponse } from '../models/graph_response.model';
import { LineChart, MarketChart } from '../models/graph.model';
import { StatsService } from '../services/stats.service';

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.css']
})
export class GraphComponentComponent implements OnInit {

  revision = 0;
  graph: ({ data: (LineChart | MarketChart)[]; layout: { width: number; height: number; title: string; xaxis: { showticklabels: boolean; }; yaxis: { showticklabels: boolean; }; showlegend: boolean; }; } | undefined) = undefined;  @Input() graphTitle: string = '';
  @Input() graphToCall: string = '';

  constructor(private stats: StatsService) { }

  ngOnInit(): void {
    const textMarkers: Array<string> = [];
    const xx: Array<number> = [];
    const yy: Array<number> = [];
    const colors: Array<string> = [];
    const colorscale = [
      "rgb(68, 1, 84)",
      "rgb(72, 40, 120)",
      "rgb(62, 74, 137)",
      "rgb(55, 64, 107)",
      "rgb(49, 104, 142)",
      "rgb(38, 130, 142)",
      "rgb(31, 158, 137)",
      "rgb(53, 183, 121)",
      "rgb(109, 205, 89)",
      "rgb(129, 215, 59)",
      "rgb(180, 222, 44)",
      "rgb(253, 231, 37)"
    ]
    const numberOfColors = colorscale.length;
    let colorIndex = 0;
    let graphdata: (LineChart|MarketChart)[] = [];

    let functionEndorses;
    if (this.graphToCall == 'endorsements'){
      functionEndorses = this.stats.getEndorses();
    }
    else{
      functionEndorses = this.stats.getComments();
    }

    functionEndorses.subscribe(
        (response: GraphResponse) => {
          for (let userIdA in response.users){
            const coordinatesA = response.positions[userIdA];
            const color = response.colors[userIdA];
            for (let userIdB in response.users[userIdA]){
              const coordinatesB = response.positions[userIdB];
              const phi = response.users[userIdA][userIdB];
              if (phi != 0){
                graphdata.push(
                  {
                    x: [coordinatesA[0], coordinatesB[0]],
                    y: [coordinatesA[1], coordinatesB[1]],
                    type: 'scatter',
                    mode: 'lines',
                    line: {color: "rgb("+color[0]+","+color[1]+","+color[2]+")", width: '1'},
                    marker: {color: 'black', size: 5},
                    text: (textMarkers),
                    hoverinfo: 'text'
                  }
                );
                colorIndex = (colorIndex + 1) % numberOfColors;
              }
            }
          }
          for(let key in response.positions){
            const coordinates = response.positions[key]
            textMarkers.push(response.usernames[key])
            xx.push(coordinates[0])
            yy.push(coordinates[1])
            colors.push("black");
          }
          this.revision += 1;

          graphdata.push({ x: xx,
            y: yy,
            type: 'scatter',
            mode: 'markers',
            marker: {color: 'black', size: 5},
            line: {color: 'blue', width: '1'},
            hoverinfo: 'text',
            text: (textMarkers)
          });

          this.graph = {
            data: graphdata,
            layout: {
              width: 1524,
               height: 1024,
               title: this.graphTitle,
                xaxis: {'showticklabels': false},
                yaxis: {'showticklabels': false},
                showlegend: false
              }
          }
      }
      );
    }


}

import { Component } from '@angular/core';
import { Endorsements } from './models/endorsements.model';
import { LineChart, MarketChart } from './models/graph.model';
import { StatsService } from './services/stats.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'decidim_viz_front';

  public graph: ({ data: (LineChart | MarketChart)[]; layout: { width: number; height: number; title: string; xaxis: { showticklabels: boolean; }; yaxis: { showticklabels: boolean; }; showlegend: boolean; }; } | undefined) = undefined;
  public revision = 0;

  constructor(private stats: StatsService){
    const textMarkers: Array<string> = []
    const xx: Array<number> = []
    const yy: Array<number> = []
    const graphdata: (LineChart|MarketChart)[] = []
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
    stats.getEndorses().subscribe(
      (response: Endorsements) => {
        for (let userIdA in response.users){
          const coordinatesA = response.positions[userIdA];
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
                  line: {color: colorscale[colorIndex], width: '1'},
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
             title: 'Futureu endorsements network',
              xaxis: {'showticklabels': false},
              yaxis: {'showticklabels': false},
              showlegend: false
            }
        }
      }
    );



  }



}

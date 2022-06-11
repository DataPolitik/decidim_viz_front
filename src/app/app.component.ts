import { Component } from '@angular/core';
import { Endorsements } from './models/endorsements.model';
import { StatsService } from './services/stats.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'decidim_viz_front';



  public graph;

  public builData(x: Array<number>, y:Array<number>){
    return {
      'x': x,
      'y': y
    }
  }

  constructor(private stats: StatsService){
    const xx: Array<number> = []
    const yy: Array<number> = []
    const text: Array<string> = []

    stats.getEndorses().subscribe(
      (response: Endorsements) => {

        for(let key in response.positions){
          const coordinates = response.positions[key]
          xx.push(coordinates[0])
          yy.push(coordinates[1])
          text.push(key)
        }
      }
    );

    const graphdata = { x: xx,
      y: yy,
      type: 'scatter',
      mode: 'markers',
      marker: {color: 'black', size: 5},
      line: {color: 'blue', width: '1'},
      hoverinfo: 'text',
      text: (text)
    };

    this.graph = {
      data: [graphdata],
      layout: {
        width: 1524,
         height: 1024,
         title: 'A Fancy Plot',
          xaxis: {'showticklabels': false},
          yaxis: {'showticklabels': false},
          showlegend: false
        }
    }

  }



}

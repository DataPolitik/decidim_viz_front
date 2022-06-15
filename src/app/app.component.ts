import { Component } from '@angular/core';
import { StatsService } from './services/stats.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'decidim_viz_front';
  activeIndex = 0;

  public caller;
  public graphTitle: string = '';

  constructor(private stats: StatsService){
    this.caller = stats.getEndorses;
    this.graphTitle = 'Endorsements';
  }



}

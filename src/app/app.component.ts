import { Component } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import { Apollo } from 'apollo-angular';
import { DECIDIM_API } from './config/decidim_api';
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
  public type: string = 'endorsements'


  changeType(event: any){
    if(event.index == 0){
      this.type="endorsements";
      this.graphTitle = 'Endorsements';
    }else if(event.index == 1){
      this.type="comments";
      this.graphTitle = 'Comments';
    }else{
      this.type="stats";

    }
  }

  constructor(private stats: StatsService, private apollo: Apollo, private httpLink: HttpLink){
    this.caller = stats.getEndorses;
    this.graphTitle = 'Endorsements';

    DECIDIM_API.forEach(api_details => {
      this.apollo.createNamed(api_details.name, {
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: api_details.url,
        }),
      });
    });
  }



}

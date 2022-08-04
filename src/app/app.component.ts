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


  public caller;






  constructor(private stats: StatsService, private apollo: Apollo, private httpLink: HttpLink){
    this.caller = stats.getEndorses;


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

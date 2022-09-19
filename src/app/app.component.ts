import { Component } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import { Apollo } from 'apollo-angular';
import { DECIDIM_API } from './config/decidim_api';
import { StatsService } from './services/stats.service';
import {TranslateService} from "@ngx-translate/core";
import { CONFIGS } from './config/config.dev';
import { TemporalLimits } from './models/temporal-limits.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'decidim_viz_front';
  public caller;

  constructor(private stats: StatsService,
              private apollo: Apollo,
              private httpLink: HttpLink,
              private translate: TranslateService){
    this.caller = stats.getEndorses;

    translate.setDefaultLang(CONFIGS.defaultLanguage);
    translate.use(CONFIGS.defaultLanguage);

    DECIDIM_API.forEach(api_details => {
      this.apollo.createNamed(api_details.name, {
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: api_details.url,
        }),
      });
    });

    this.stats.subscribeTemporalLimits();
  }



}

import { Component } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import { Apollo } from 'apollo-angular';
import { DECIDIM_API } from './config/decidim_api';
import { StatsService } from './services/stats.service';
import {TranslateService} from "@ngx-translate/core";
import { CONFIGS } from './config/config.dev';
import { Subscription } from 'rxjs';
import { PARTICIPATORY_PROCESSES, TEMPORAL_LIMITS_PARTICIPATORY_PROCESSES } from './graphql/graphql.queries';
import { execute_metrics_query } from './utils/metrics.utils';
import { TemporalLimitsGraphHQL } from './models/temporal-limits-graphql.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  protected subs = new Subscription();

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

    this.stats.subscribeTemporalLimitsAPI();

    this.subs.add(execute_metrics_query(this.apollo, TEMPORAL_LIMITS_PARTICIPATORY_PROCESSES).subscribe(({ data, loading }) => {
      const fromDate = data['participatoryProcesses'][0]['publishedAt'];
      const toDate = data['participatoryProcesses'].at(-1)['publishedAt'];

      const temporalLimits: TemporalLimitsGraphHQL = {
        'participatory_processes_from': fromDate,
        'participatory_processes_to': toDate
      }
      this.stats.setTemporalLimitsGraphHQL(temporalLimits);
    }));

  }


}

import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { METRICS_COMMENTS, METRICS_PARTICIPATORY_PROCESSES, METRICS_PROPOSALS, METRICS_USERS } from '../graphql/graphql.queries';
import { Metrics } from '../models/metrics.model';

import {HttpLink} from 'apollo-angular/http';
import { DECIDIM_API } from '../config/decidim_api';
import { DocumentNode, InMemoryCache, TypedDocumentNode } from '@apollo/client/core';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit, OnDestroy  {

  constructor(private apollo: Apollo, private httpLink: HttpLink) {
    DECIDIM_API.forEach(api_details => {
      this.apollo.createNamed(api_details.name, {
        cache: new InMemoryCache(),
        link: httpLink.create({
          uri: api_details.url,
        }),
      });
    });

  }

  private userQuerySubscription: Subscription | undefined;
  private proposalQuerySubscription: Subscription | undefined;
  private participatory_processesSubscription: Subscription | undefined;
  private commentsSubscription: Subscription | undefined;

  user_loading: boolean = true;
  proposal_loading: boolean = true;
  participatory_processes_loading: boolean = true;
  comments_loading: boolean = true;

  user_metrics: Metrics | undefined;
  proposal_metrics: Metrics | undefined;
  participatory_processes_metrics: Metrics | undefined;
  comments_metrics: Metrics | undefined;


  private execute_metrics_query(gql_to_execute: DocumentNode ){
    return this.apollo.use('futureu').watchQuery<any>({
      query: gql_to_execute
    }).valueChanges

  }

  ngOnInit(): void {
    this.userQuerySubscription = this.execute_metrics_query(METRICS_USERS).subscribe(({ data, loading }) => {
      this.user_loading = loading;
      this.user_metrics = data.metrics[0];
    });

    this.proposalQuerySubscription = this.execute_metrics_query(METRICS_PROPOSALS).subscribe(({ data, loading }) => {
      this.proposal_loading = loading;
      this.proposal_metrics = data.metrics[0];
    });

    this.participatory_processesSubscription = this.execute_metrics_query(METRICS_PARTICIPATORY_PROCESSES).subscribe(({ data, loading }) => {
      this.participatory_processes_loading = loading;
      this.participatory_processes_metrics = data.metrics[0];
    });

    this.commentsSubscription = this.execute_metrics_query(METRICS_COMMENTS).subscribe(({ data, loading }) => {
      this.comments_loading = loading;
      this.comments_metrics = data.metrics[0];
    });
  }

  ngOnDestroy() {
    this.userQuerySubscription?.unsubscribe();
    this.proposalQuerySubscription?.unsubscribe();
    this.participatory_processesSubscription?.unsubscribe();
    this.commentsSubscription?.unsubscribe();
  }

}

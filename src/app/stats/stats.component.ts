import { Component, OnInit, OnDestroy  } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Subscription } from 'rxjs';
import { METRICS_COMMENTS, METRICS_PARTICIPATORY_PROCESSES, METRICS_PROPOSALS, METRICS_USERS } from '../graphql/graphql.queries';
import { Metrics } from '../models/metrics.model';
import { StatsService } from '../services/stats.service';


import { execute_metrics_query } from '../utils/metrics.utils';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit, OnDestroy  {
  private subs = new Subscription();
  private languageCountSubject = new BehaviorSubject<number>(0);
  private languageCountObservable = this.languageCountSubject.asObservable();

  public options: AgChartOptions | undefined;


  constructor(private apollo: Apollo, private statsService: StatsService) {}

  user_loading: boolean = true;
  proposal_loading: boolean = true;
  participatory_processes_loading: boolean = true;
  comments_loading: boolean = true;

  user_metrics: Metrics | undefined;
  proposal_metrics: Metrics | undefined;
  participatory_processes_metrics: Metrics | undefined;
  comments_metrics: Metrics | undefined;

  languages: Array<string> | undefined = undefined;
  language_count: Array<{name:string, size: number, color: number}> = [];





  ngOnInit(): void {
    this.subs.add(execute_metrics_query(this.apollo, METRICS_USERS).subscribe(({ data, loading }) => {
      this.user_loading = loading;
      this.user_metrics = data.metrics[0];
    }));

    this.subs.add(execute_metrics_query(this.apollo, METRICS_PROPOSALS).subscribe(({ data, loading }) => {
      this.proposal_loading = loading;
      this.proposal_metrics = data.metrics[0];
    }));

    this.subs.add(execute_metrics_query(this.apollo, METRICS_PARTICIPATORY_PROCESSES).subscribe(({ data, loading }) => {
      this.participatory_processes_loading = loading;
      this.participatory_processes_metrics = data.metrics[0];
    }));

    this.subs.add( execute_metrics_query(this.apollo, METRICS_COMMENTS).subscribe(({ data, loading }) => {
      this.comments_loading = loading;
      this.comments_metrics = data.metrics[0];
    }));

    this.processLanguageTreemap();

    this.subs.add(this.statsService.getLanguages().subscribe(
      (languages_response) => {
        this.languages = languages_response;
        let counter = 0;
        this.languages.forEach(
          (language: string) => {
            this.subs.add(this.statsService.getLanguagesCount(language).subscribe(
              (language_count) => {this.language_count?.push({
                name: language,
                size: Number(language_count),
                color: 100*(Number(language_count)/22519)
              });
              this.processLanguageTreemap();
            }
           ));
          }
        );
      }
    ));

    this.subs.add(
      this.languageCountObservable.subscribe()
    );
  }

  processLanguageTreemap() {
    const data = {
      name: 'Root',
      children: this.language_count
    }
    this.options = {
      type: 'hierarchy',
      data,
      series: [
        {
          type: 'treemap',
          labelKey: 'name',
          sizeKey: 'size',
          colorKey: 'color',
          tooltip: {
            renderer: (params) => {
              return {
                content: `<b>Número de comentarios</b>: ${params.datum.datum.size}`,
              };
            },
          },
        },
      ],
      title: {
        text: 'S&P 500 index stocks categorized by sectors and industries.',
      },
      subtitle: {
        text:
          'Area represents market cap. Color represents change from the day before.',
      },
    };
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}


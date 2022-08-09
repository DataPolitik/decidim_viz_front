import { Component, Input, OnInit } from '@angular/core';
import { groupBy, of, reduce, mergeMap } from 'rxjs';
import { PARTICIPATORY_PROCESSES } from 'src/app/graphql/graphql.queries';
import { Metrics } from 'src/app/models/metrics.model';
import { Metrics_History } from 'src/app/models/metrics_history.model';
import { execute_metrics_query, groupByAndCount } from 'src/app/utils/metrics.utils';
import { AbstractMetricsComponent } from '../abstract-metrics/abstract-metrics.component';

@Component({
  selector: 'app-metrics-participative-processes',
  templateUrl: './participative-processes.component.html',
  styleUrls: ['./participative-processes.component.css']
})
export class ParticipativeProcessesComponent extends AbstractMetricsComponent implements OnInit {
  public accumulated_participatory_processes_metrics : Metrics | undefined;

  override ngOnInit(): void {
    this.dateChanged();

    if (this.dateFrom && this.dateTo){
      const parameters={
        dateFrom: this.dateFromAsString,
        dateTo: this.dateToAsString
      }
      this.subs.add(execute_metrics_query(this.apollo, PARTICIPATORY_PROCESSES, parameters).subscribe(({ data, loading }) => {
        const cleanedData: any = [];
        this.isEmpty = data.participatoryProcesses.length == 0;
        for(let i=0; i < data.participatoryProcesses.length; ++i){
          cleanedData.push(
            {
              'publishedAt': data.participatoryProcesses[i].publishedAt.substring(0,10),
              'id': data.participatoryProcesses[i].id
            }
          )
        }
        const groupedData = groupByAndCount(cleanedData,['publishedAt']);
        const dailyHistory:  Metrics_History[] = [];
        const accumulatedyHistory:  Metrics_History[] = [];

        let accumulated = 0;
        groupedData[0].forEach((element: { count: any; value: any; accumulated: any}) => {
          dailyHistory.push(
            {
              'value': element.count,
              'key': element.value,
            } as Metrics_History
          )
          accumulatedyHistory.push(
            {
              'value': accumulated,
              'key': element.value,
            } as Metrics_History
          )
          accumulated = accumulated + element.count;
        }
        )

        this.daily_participatory_processes_metrics = {
          'count': cleanedData.length,
          'name': 'dailyParticipatoryProcesses',
          'history': dailyHistory
        }

        this.accumulated_participatory_processes_metrics = {
          'count': cleanedData.length,
          'name': 'accumulatedParticipatoryProcesses',
          'history': accumulatedyHistory
        }

        console.log(this.accumulated_participatory_processes_metrics);

        this.participatory_processes_loading = false;
        this.loadedGraphs = 2;
      }));
    }
  }

}


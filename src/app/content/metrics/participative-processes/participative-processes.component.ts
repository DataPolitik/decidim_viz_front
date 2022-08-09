import { Component, Input, OnInit } from '@angular/core';
import { groupBy, of, reduce, mergeMap } from 'rxjs';
import { PARTICIPATORY_PROCESSES } from 'src/app/graphql/graphql.queries';
import { Metrics_History } from 'src/app/models/metrics_history.model';
import { execute_metrics_query, groupByAndCount } from 'src/app/utils/metrics.utils';
import { AbstractMetricsComponent } from '../abstract-metrics/abstract-metrics.component';

@Component({
  selector: 'app-metrics-participative-processes',
  templateUrl: './participative-processes.component.html',
  styleUrls: ['./participative-processes.component.css']
})
export class ParticipativeProcessesComponent extends AbstractMetricsComponent implements OnInit {

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
        const history:  Metrics_History[] = [];

        groupedData[0].forEach((element: { count: any; value: any; }) => {
          history.push(
            {
              'value': element.count,
              'key': element.value
            } as Metrics_History
          )
        }
        )

        this.participatory_processes_metrics = {
          'count': cleanedData.length,
          'name': 'participatoryProcesses',
          'history': history
        }

        this.participatory_processes_loading = false;
      }));
    }
  }

}


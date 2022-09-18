import { Component, Input, OnInit } from '@angular/core';
import { groupBy, of, reduce, mergeMap } from 'rxjs';
import { PARTICIPATORY_PROCESSES, PARTICIPATORY_PROCESSES_COUNT } from 'src/app/graphql/graphql.queries';
import { Activities } from 'src/app/models/activities.model';
import { Activities_History } from 'src/app/models/activities_history.model';
import { execute_metrics_query, groupByAndCount } from 'src/app/utils/metrics.utils';
import { AbstractActivitiesComponent } from '../abstract-activities/abstract-activities.component';

@Component({
  selector: 'app-activities-participative-processes',
  templateUrl: './participative-processes.component.html',
  styleUrls: ['./participative-processes.component.css']
})
export class ParticipativeProcessesComponent extends AbstractActivitiesComponent implements OnInit {
  public accumulated_participatory_processes_activities : Activities | undefined;
  public daily_participatory_processes_activities : Activities | undefined;

  private getHistoricalData(countData: number){
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
      const dailyHistory:  Activities_History[] = [];
      const accumulatedyHistory:  Activities_History[] = [];

      let accumulated = countData;
      groupedData[0].forEach((element: { count: any; value: any; accumulated: any}) => {
        dailyHistory.push(
          {
            'value': element.count,
            'key': element.value,
          } as Activities_History
        )
        accumulatedyHistory.push(
          {
            'value': accumulated,
            'key': element.value,
          } as Activities_History
        )
        accumulated = accumulated + element.count;
      }
      )

      this.daily_participatory_processes_activities = {
        'count': cleanedData.length,
        'name': 'dailyParticipatoryProcesses',
        'history': dailyHistory
      }

      this.accumulated_participatory_processes_activities = {
        'count': cleanedData.length,
        'name': 'accumulatedParticipatoryProcesses',
        'history': accumulatedyHistory
      }

      this.participatory_processes_loading = false;
      this.loadedGraphs = 2;
    }));
  }

  override ngOnInit(): void {
    this.dateChanged();

    if (this.dateFrom && this.dateTo){
      const parameters={
        dateTo: this.dateFromAsString,
      }

      this.subs.add(execute_metrics_query(this.apollo, PARTICIPATORY_PROCESSES_COUNT, parameters).subscribe(({ data, loading }) => {
        const countData = data.participatoryProcesses.length;
        this.getHistoricalData(countData);
      }));

    }
  }

}


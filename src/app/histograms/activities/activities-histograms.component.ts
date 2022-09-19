import { Component, Input, OnInit } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';
import { Activities_History } from 'src/app/models/activities_history.model';

@Component({
  selector: 'app-activities-histogram',
  templateUrl: './activities-histograms.component.html',
  styleUrls: ['./activities-histograms.component.css']
})
export class ActivitiesHistogramComponent implements OnInit {

  @Input() title: string = "";
  @Input() xName: string = "";
  @Input() yName: string = "";
  @Input() response: Array<Activities_History> | undefined;

  public options: AgChartOptions | undefined = undefined;

  constructor() { }

  ngOnInit(): void {
    this.options = {
      autoSize: true,
      title: {
        text: this.title,
      },
      data: this.response,
      series: [
        {
          type: 'line',
          xKey: 'key',
          xName: this.xName,
          yKey: 'value',
          yName: this.yName
        },
      ],
      legend: { enabled: false},
      axes: [
        {
          type: 'number',
          position: 'left',
          title: {
            text: this.yName,
          },
          label: {
            format: ',.0f',
            fontSize: 10,
          },
        },
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: this.xName,
          },
          label: {
            fontSize: 10,
          },
        },
      ],
    };
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';
import { Metrics } from 'src/app/models/metrics.model';
import { Metrics_History } from 'src/app/models/metrics_history.model';

@Component({
  selector: 'app-metrics-histogram',
  templateUrl: './metrics-histograms.component.html',
  styleUrls: ['./metrics-histograms.component.css']
})
export class MetricsHistogramComponent implements OnInit {

  @Input() title: string = "";
  @Input() xName: string = "";
  @Input() yName: string = "";
  @Input() response: Array<Metrics_History> | undefined;

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

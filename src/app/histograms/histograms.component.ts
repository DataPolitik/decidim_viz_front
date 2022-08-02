import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgChartOptions } from 'ag-charts-community';
import { Observable, Subscription } from 'rxjs';
import { Histogram } from '../models/histogram.model';
import { StatsService } from '../services/stats.service';

@Component({
  selector: 'app-histograms',
  templateUrl: './histograms.component.html',
  styleUrls: ['./histograms.component.css']
})
export class HistogramsComponent implements OnInit, OnDestroy {
  private commentsSubscription: Subscription | undefined;
  private endorsesSubscription: Subscription | undefined;

  public optionsComments: AgChartOptions | undefined = undefined;
  public optionsEndorses: AgChartOptions | undefined = undefined;

  constructor(private stats: StatsService) {  }


  ngOnInit(): void {
    this.commentsSubscription = this.stats.getCommentsHistogram().subscribe(
      (response: Histogram) => {

        this.optionsComments = {
          title: {
            text: 'Proposals commented histogram',
          },
          data: response.histogram,
          series: [
            {
              type: 'column',
              xKey: 'count',
              xName: 'Endorses',
              yKey: 'size',
              yName: 'Size'
            },
          ],
          axes: [
            {
              type: 'number',
              position: 'left',
              title: {
                text: 'Proposals',
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
                text: 'Endorses',
              },
              label: {
                fontSize: 10,
              },
            },
          ],
        };

      }
    );

    this.endorsesSubscription = this.stats.getEndorsesHistogram().subscribe(
      (response: Histogram) => {
        this.optionsEndorses = {
          title: {
            text: 'Proposals endorses histogram',
          },
          data: response.histogram,
          series: [
            {
              type: 'column',
              xKey: 'count',
              xName: 'Endorses',
              yKey: 'size',
              yName: 'Size'
            },
          ],
        };
      }
    );
  }

  ngOnDestroy(){
    this.commentsSubscription?.unsubscribe();
    this.endorsesSubscription?.unsubscribe();
  }

}

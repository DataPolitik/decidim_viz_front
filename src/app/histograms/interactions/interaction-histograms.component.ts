import { Component, OnDestroy, OnInit } from '@angular/core';
import { AgChartOptions, AgHistogramSeriesOptions } from 'ag-charts-community';
import { Observable, Subscription } from 'rxjs';
import { Proposal } from 'src/app/models/proposal.model';
import { Histogram } from '../../models/histogram.model';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-histograms',
  templateUrl: './interaction-histograms.component.html',
  styleUrls: ['./interaction-histograms.component.css']
})
export class InteractionHistogramComponent implements OnInit, OnDestroy {
  private commentsSubscription: Subscription | undefined;
  private endorsesSubscription: Subscription | undefined;
  private topCommentedSubscription: Subscription | undefined;
  private topEndorsedSubscription: Subscription | undefined;

  public optionsComments: AgChartOptions | undefined = undefined;
  public optionsEndorses: AgChartOptions | undefined = undefined;

  public topCommented: Proposal | undefined = undefined;
  public topEndorsed: Proposal | undefined = undefined;

  constructor(private stats: StatsService) {  }

  private generateOptions(title: string, xName: string, yName: string): AgChartOptions{
    return {
      title: {
        text: title,
      },
      series: [
        {
          type: 'column',
          xKey: 'comments',
          xName: xName,
          yKey: 'count',
          yName: yName
        },
      ],
      axes: [
        {
          type: 'category',
          position: 'bottom',
          title: {
            text: xName,
          },
        },
        {
          type: 'log',
          position: 'left',
          min: 1,
          label: {
            format: '.0f',
          },
          tick: {
            count: 10,
          },
          title: {
            text: yName,
          },
        }],
      legend: {
        enabled: false,
      },
    };
  }

  ngOnInit(): void {

    this.commentsSubscription = this.stats.getCommentsHistogram().subscribe(
      (response) => {
          this.optionsComments = this.generateOptions("Comments per proposal", "Number of comments", "Number of proposals");
          this.optionsComments.data = response.histogram;
      }
    );

    this.endorsesSubscription = this.stats.getEndorsesHistogram().subscribe(
      (response: Histogram) => {
          this.optionsEndorses = this.generateOptions("Endorsements per proposal", "Number of endorsements", "Number of proposals");
          this.optionsEndorses.data = response.histogram;
      }
    );

    this.topCommentedSubscription = this.stats.getMostCommentedProposal().subscribe(
      (response: Proposal) => {
        this.topCommented = response
      }
    );

    this.topEndorsedSubscription = this.stats.getMostEndorsedProposal().subscribe(
      (response: Proposal) => {
        this.topEndorsed = response
      }
    );
  }

  ngOnDestroy(){
    this.commentsSubscription?.unsubscribe();
    this.endorsesSubscription?.unsubscribe();
    this.topCommentedSubscription?.unsubscribe();
    this.topEndorsedSubscription?.unsubscribe();
  }

}

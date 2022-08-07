import { Component, OnInit } from '@angular/core';
import { Histogram } from 'src/app/models/histogram.model';
import { Metrics } from 'src/app/models/metrics.model';
import { StatsComponent } from 'src/app/stats/stats.component';

@Component({
  selector: 'app-content-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent extends StatsComponent implements OnInit {
  public dateFrom: Date = new Date();
  public dateTo: Date = new Date();

  public accumulated_proposal_loading: boolean = true;
  public accumulated_comment_loading: boolean = true;
  public accumulated_proposal_metrics: Metrics | undefined;
  public accumulated_comment_metrics: Metrics | undefined;

  override ngOnInit(): void {
    this.dateFrom.setDate(this.dateFrom.getDate() - 90)
  }

  public dateChanged(){

    /// THIS IS A WORKAROUND FOR THIS BUG OF PRIME_NG
    /// https://github.com/primefaces/primeng/issues/2426
    const fixedDateFrom = new Date(this.dateFrom);
    const fixedDateTo = new Date(this.dateTo);

    fixedDateFrom.setDate(fixedDateFrom.getDate() + 1)
    fixedDateTo.setDate(fixedDateTo.getDate() + 1)

    //// TODO: REMOVE THIS WORKAROUND WHEN THE BUG GET FIXED


    const dateFromAsString = fixedDateFrom.toISOString().split('T')[0];
    const dateToAsString = fixedDateTo.toISOString().split('T')[0];
    this.statsService.getDailyNumberOfProposalsByRange(dateFromAsString, dateToAsString).subscribe(
      (response: Metrics) => {
        this.daily_proposal_loading = false;
        this.daily_proposal_metrics = response;
      }
    )

    this.statsService.getAccumulatedNumberOfProposalsByRange(dateFromAsString, dateToAsString).subscribe(
      (response: Metrics) => {
        this.accumulated_proposal_loading = false;
        this.accumulated_proposal_metrics = response;
      }
    )

    this.statsService.getDailyNumberOfCommentsByRange(dateFromAsString, dateToAsString).subscribe(
      (response: Metrics) => {
        this.daily_comment_loading = false;
        this.daily_comment_metrics = response;
      }
    )

    this.statsService.getAccumulatedNumberOfCommentsByRange(dateFromAsString, dateToAsString).subscribe(
      (response: Metrics) => {
        this.accumulated_comment_loading = false;
        this.accumulated_comment_metrics = response;
      }
    )
  }
}

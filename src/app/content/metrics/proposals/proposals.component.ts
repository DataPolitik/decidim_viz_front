import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Metrics } from 'src/app/models/metrics.model';
import { StatsComponent } from 'src/app/stats/stats.component';

@Component({
  selector: 'app-metrics-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent extends StatsComponent implements OnInit, OnDestroy {
  @Input() dateFromAsString: string = '';
  @Input() dateToAsString: string = '';

  public accumulated_proposal_metrics: Metrics | undefined;
  public accumulated_proposal_loading: boolean = true;

  private accumulatedSubscription: Subscription | undefined;
  private dailySubscription: Subscription | undefined;

  override ngOnInit(): void {
    if (this.dateFromAsString && this.dateToAsString)
      this.accumulatedSubscription = this.statsService.getAccumulatedNumberOfProposalsByRange(this.dateFromAsString, this.dateToAsString).subscribe(
        (response: Metrics) => {
          this.accumulated_proposal_loading = false;
          this.accumulated_proposal_metrics = response;
        }
      )

      this.dailySubscription = this.statsService.getDailyNumberOfProposalsByRange(this.dateFromAsString, this.dateToAsString ).subscribe(
        (response: Metrics) => {
          this.daily_proposal_loading = false;
          this.daily_proposal_metrics = response;
        }
      )
  }

  override ngOnDestroy(): void {
    this.accumulatedSubscription?.unsubscribe();
    this.dailySubscription?.unsubscribe();
  }



}

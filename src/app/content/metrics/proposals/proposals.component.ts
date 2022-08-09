import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Metrics } from 'src/app/models/metrics.model';
import { AbstractMetricsComponent } from '../abstract-metrics/abstract-metrics.component';

@Component({
  selector: 'app-metrics-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent extends AbstractMetricsComponent implements OnInit, OnDestroy {

  public accumulated_proposal_metrics: Metrics | undefined;
  public accumulated_proposal_loading: boolean = true;

  private accumulatedSubscription: Subscription | undefined;
  private dailySubscription: Subscription | undefined;

  public loadedGraphs = 0;


  override ngOnInit(): void {
    this.dateChanged();
    this.loadedGraphs = 0;

    if (this.dateFrom && this.dateTo){
      this.accumulatedSubscription = this.statsService.getAccumulatedNumberOfProposalsByRange(this.dateFromAsString, this.dateToAsString).subscribe(
        (response: Metrics) => {
          this.accumulated_proposal_loading = false;
          this.accumulated_proposal_metrics = response;
          this.loadedGraphs = this.loadedGraphs + 1;
          this.isEmpty = response.history.length == 0;
        }
      )


      this.dailySubscription = this.statsService.getDailyNumberOfProposalsByRange(this.dateFromAsString, this.dateToAsString ).subscribe(
        (response: Metrics) => {
          this.daily_proposal_loading = false;
          this.daily_proposal_metrics = response;
          this.loadedGraphs = this.loadedGraphs + 1;
          this.isEmpty = response.history.length == 0;
        }
      )
    }
  }

  override ngOnDestroy(): void {
    this.accumulatedSubscription?.unsubscribe();
    this.dailySubscription?.unsubscribe();
  }



}

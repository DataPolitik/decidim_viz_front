import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Metrics } from 'src/app/models/metrics.model';
import { StatsComponent } from 'src/app/stats/stats.component';

@Component({
  selector: 'app-metrics-proposals',
  templateUrl: './proposals.component.html',
  styleUrls: ['./proposals.component.css']
})
export class ProposalsComponent extends StatsComponent implements OnInit, OnDestroy {
  @Input() dateFrom: Date = new Date();
  @Input() dateTo: Date = new Date();

  public dateFromAsString: string = '';
  public dateToAsString: string = '';

  public accumulated_proposal_metrics: Metrics | undefined;
  public accumulated_proposal_loading: boolean = true;

  private accumulatedSubscription: Subscription | undefined;
  private dailySubscription: Subscription | undefined;

  public loadedGraphs = 0;
  public isEmpty = true;

  public dateChanged(){

    /// THIS IS A WORKAROUND FOR THIS BUG OF PRIME_NG
    /// https://github.com/primefaces/primeng/issues/2426
    const fixedDateFrom = new Date(this.dateFrom);
    const fixedDateTo = new Date(this.dateTo);

    fixedDateFrom.setDate(fixedDateFrom.getDate() + 1)
    fixedDateTo.setDate(fixedDateTo.getDate() + 1)

    //// TODO: REMOVE THIS WORKAROUND WHEN THE BUG GET FIXED


    this.dateFromAsString = fixedDateFrom.toISOString().split('T')[0];
    this.dateToAsString = fixedDateTo.toISOString().split('T')[0];


  }

  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();
  }


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

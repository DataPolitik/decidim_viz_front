import { Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { Metrics } from 'src/app/models/metrics.model';
import { AbstractMetricsComponent } from '../abstract-metrics/abstract-metrics.component';

@Component({
  selector: 'app-metrics-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent extends AbstractMetricsComponent implements OnInit, OnDestroy {

  public accumulated_comment_metrics: Metrics | undefined;
  public accumulated_comment_loading: boolean = true;

  private accumulatedSubscription: Subscription | undefined;
  private dailySubscription: Subscription | undefined;

  override ngOnInit(): void {
    this.dateChanged();
    this.loadedGraphs = 0;

    if (this.dateFrom && this.dateTo){
      this.accumulatedSubscription = this.statsService.getAccumulatedNumberOfCommentsByRange(this.dateFromAsString, this.dateToAsString).subscribe(
        (response: Metrics) => {
          this.accumulated_comment_loading = false;
          this.accumulated_comment_metrics = response;
          this.loadedGraphs = this.loadedGraphs + 1;
          this.isEmpty = response.history.length == 0;
        }
      )


      this.dailySubscription = this.statsService.getDailyNumberOfCommentsByRange(this.dateFromAsString, this.dateToAsString ).subscribe(
        (response: Metrics) => {
          this.daily_comment_loading = false;
          this.daily_comment_metrics = response;
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

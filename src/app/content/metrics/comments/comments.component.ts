import { Component, Input, OnInit } from '@angular/core';
import { Metrics } from 'src/app/models/metrics.model';
import { AbstractMetricsComponent } from '../abstract-metrics/abstract-metrics.component';

@Component({
  selector: 'app-metrics-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent extends AbstractMetricsComponent implements OnInit {
  public accumulated_comment_loading: boolean = true;
  public accumulated_comment_metrics: Metrics | undefined;


  override ngOnInit(): void {

    this.statsService.getDailyNumberOfCommentsByRange(this.dateFromAsString, this.dateToAsString ).subscribe(
      (response: Metrics) => {
        this.daily_comment_loading = false;
        this.daily_comment_metrics = response;
      }
    )

    this.statsService.getAccumulatedNumberOfCommentsByRange(this.dateFromAsString, this.dateToAsString ).subscribe(
      (response: Metrics) => {
        this.accumulated_comment_loading = false;
        this.accumulated_comment_metrics = response;
      }
    )
  }

}

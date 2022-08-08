import { Component, Input, OnInit } from '@angular/core';
import { Metrics } from 'src/app/models/metrics.model';
import { StatsComponent } from 'src/app/stats/stats.component';

@Component({
  selector: 'app-metrics-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent extends StatsComponent implements OnInit {
  @Input() dateFromAsString: string = '';
  @Input() dateToAsString: string = '';

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

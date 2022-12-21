import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Activities } from 'src/app/models/activities.model';
import { AbstractActivitiesComponent } from '../abstract-activities/abstract-activities.component';

@Component({
  selector: 'app-activities-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent extends AbstractActivitiesComponent implements OnInit, OnDestroy {

  public accumulated_comment_metrics: Activities | undefined;
  public accumulated_comment_loading: boolean = true;

  private accumulatedSubscription: Subscription | undefined;
  private dailySubscription: Subscription | undefined;

  daily_comment_loading: boolean = true;
  public daily_comment_metrics: Activities | undefined;

  override ngOnInit(): void {
    this.dateChanged();
    this.loadedGraphs = 0;

    if (this.dateFrom && this.dateTo){
      this.accumulatedSubscription = this.statsService.getAccumulatedNumberOfCommentsByRange(this.dateFromAsString, this.dateToAsString).subscribe(
        (response: Activities) => {
          this.accumulated_comment_loading = false;
          this.accumulated_comment_metrics = response;
          this.loadedGraphs = this.loadedGraphs + 1;
          this.isEmpty = response.history.length == 0;
        }
      )


      this.dailySubscription = this.statsService.getDailyNumberOfCommentsByRange(this.dateFromAsString, this.dateToAsString ).subscribe(
        (response: Activities) => {
          this.daily_comment_loading = false;
          this.daily_comment_metrics = response;
          this.loadedGraphs = this.loadedGraphs + 1;
          this.isEmpty = response.history.length == 0;
        }
      )
    }
  }

  ngOnDestroy(): void {
    this.accumulatedSubscription?.unsubscribe();
    this.dailySubscription?.unsubscribe();
  }



}

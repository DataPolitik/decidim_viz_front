import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TemporalLimits } from 'src/app/models/temporal-limits.model';
import { StatsService } from 'src/app/services/stats.service';
import { StatsComponent } from 'src/app/stats/stats.component';

@Component({
  selector: 'app-content-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent extends StatsComponent implements OnInit, OnDestroy {
  public dateFromLimit: Date | undefined = undefined;
  public dateToLimit: Date | undefined = undefined;
  public dateFrom: Date | undefined = undefined;
  public dateTo: Date | undefined = undefined;
  public temporalLimits: TemporalLimits | undefined;

  public dateFromAsString: string | undefined;
  public dateToAsString: string | undefined;

  private temporalLimitsSubscription:  Subscription |undefined = undefined;

  override ngOnInit(): void {
    this.temporalLimitsSubscription = this.statsService.getTemporalLimits().subscribe(
      (temporaLimits: TemporalLimits | undefined) => {
        if(temporaLimits){
          this.dateTo = new Date(temporaLimits.to);
          this.dateToLimit = new Date(temporaLimits.to);
          this.dateFromLimit = new Date(temporaLimits.from);

          this.dateFrom  = new Date(temporaLimits.to);
          this.dateFrom.setDate(this.dateFrom.getDate() - 90);
          this.dateChanged();
          this.ref.detectChanges();
        }
        this.temporalLimits = temporaLimits;
      }
    )
  }

  override ngOnDestroy(){
    super.ngOnDestroy();
    this.temporalLimitsSubscription?.unsubscribe();
  }


  public dateChanged(){
    if(this.dateFrom == undefined || this.dateTo  == undefined){
      return;
    }

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
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TemporalLimitsAPI } from 'src/app/models/temporal-limits-api.model';
import { TemporalLimitsGraphHQL } from 'src/app/models/temporal-limits-graphql.model';
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
  public temporalLimitsAPI: TemporalLimitsAPI | undefined;
  public temporalLimitsGraphHQL: TemporalLimitsGraphHQL | undefined;

  public dateFromAsString: string | undefined;
  public dateToAsString: string | undefined;

  private temporalLimitsAPISubscription:  Subscription |undefined = undefined;
  private temporalLimitsGraphHQLSubscription:  Subscription |undefined = undefined;

  private updateLimitsDate(typeOfDates: string){
    if(typeOfDates == 'proposals'){
      if(this.temporalLimitsAPI){
        this.dateTo = new Date(this.temporalLimitsAPI?.proposals_to);
        this.dateToLimit = new Date(this.temporalLimitsAPI?.proposals_to);
        this.dateFromLimit = new Date(this.temporalLimitsAPI?.proposals_from);

        this.dateFrom  = new Date(this.temporalLimitsAPI?.proposals_to);
        this.dateFrom.setDate(this.dateFrom.getDate() - 90);
      }
    }
    else if(typeOfDates == 'comments'){
      if(this.temporalLimitsAPI){
        this.dateTo = new Date(this.temporalLimitsAPI?.comments_to);
        this.dateToLimit = new Date(this.temporalLimitsAPI?.comments_to);
        this.dateFromLimit = new Date(this.temporalLimitsAPI?.comments_from);

        this.dateFrom  = new Date(this.temporalLimitsAPI?.comments_from);
        this.dateFrom.setDate(this.dateFrom.getDate() - 90);
      }
    }
    else if(typeOfDates == 'processes'){
      if(this.temporalLimitsGraphHQL){
        this.dateTo = new Date(this.temporalLimitsGraphHQL?.participatory_processes_to);
        this.dateToLimit = new Date(this.temporalLimitsGraphHQL?.participatory_processes_to);
        this.dateFromLimit = new Date(this.temporalLimitsGraphHQL?.participatory_processes_from);

        this.dateFrom  = new Date(this.temporalLimitsGraphHQL?.participatory_processes_from);
      }
    }
    this.dateChanged();
    this.ref.detectChanges();
  }

  override ngOnInit(): void {
    this.temporalLimitsAPISubscription = this.statsService.getTemporalLimitsAPI().subscribe(
      (temporaLimits: TemporalLimitsAPI | undefined) => {
        this.temporalLimitsAPI = temporaLimits;
        this.updateLimitsDate('proposals');
      }
    );
    this.temporalLimitsGraphHQLSubscription = this.statsService.getTemporalLimitsGraphHQL().subscribe(
      (temporalLimits: TemporalLimitsGraphHQL | undefined) => {
          this.temporalLimitsGraphHQL = temporalLimits;
      }
    );

  }

  override ngOnDestroy(){
    super.ngOnDestroy();
    this.temporalLimitsAPISubscription?.unsubscribe();
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

  handleChange(event: any) {
    const index = event.index;

    switch(index){
      case 0:
        this.updateLimitsDate('proposals');
        break;
      case 1:
        this.updateLimitsDate('processes');
        break;
      case 2:
        this.updateLimitsDate('comments');
        break;
    }
}
}

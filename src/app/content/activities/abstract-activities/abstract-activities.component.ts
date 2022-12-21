import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { TemporalLimitsAPI } from 'src/app/models/temporal-limits-api.model';
import { TemporalLimitsGraphHQL } from 'src/app/models/temporal-limits-graphql.model';
import { StatsService } from 'src/app/services/stats.service';


@Component({ template: '' })
export abstract class AbstractActivitiesComponent implements OnInit {
  public dateFrom: Date = new Date();
  public dateTo: Date = new Date();
  @Input() public minDate: Date = new Date();
  @Input() public maxDate: Date = new Date();

  protected subs = new Subscription();

  public temporalLimitsGraphHQL: TemporalLimitsGraphHQL | undefined;

  public dateFromAsString: string = '';
  public dateToAsString: string = '';

  public isEmpty = true;
  public loadedGraphs: number = 0;

  public temporalLimitsAPI: TemporalLimitsAPI | undefined;

  private temporalLimitsAPISubscription:  Subscription |undefined = undefined;
  private temporalLimitsGraphHQLSubscription:  Subscription |undefined = undefined;

  constructor(protected statsService: StatsService, protected apollo: Apollo, protected ref: ChangeDetectorRef){
    this.temporalLimitsAPISubscription = this.statsService.getTemporalLimitsAPI().subscribe(
      (temporaLimits: TemporalLimitsAPI | undefined) => {
        this.temporalLimitsAPI = temporaLimits;
      }
    );
    this.temporalLimitsGraphHQLSubscription = this.statsService.getTemporalLimitsGraphHQL().subscribe(
      (temporalLimits: TemporalLimitsGraphHQL | undefined) => {
          this.temporalLimitsGraphHQL = temporalLimits;
      }
    );
  }

  ngOnInit(){

  }

  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();
  }

  protected updateLimitsDate(typeOfDates: string){
    if(typeOfDates == 'proposals'){
      if(this.temporalLimitsAPI){
        this.dateTo = new Date(this.temporalLimitsAPI?.proposals_to);
        this.maxDate = new Date(this.temporalLimitsAPI?.proposals_to);
        this.minDate = new Date(this.temporalLimitsAPI?.proposals_from);

        this.dateFrom  = new Date(this.temporalLimitsAPI?.proposals_to);
        this.dateFrom.setDate(this.dateFrom.getDate() - 90);
      }
    }
    else if(typeOfDates == 'comments'){
      if(this.temporalLimitsAPI){
        this.dateTo = new Date(this.temporalLimitsAPI?.comments_to);
        this.maxDate = new Date(this.temporalLimitsAPI?.comments_to);
        this.minDate = new Date(this.temporalLimitsAPI?.comments_from);

        this.dateFrom  = new Date(this.temporalLimitsAPI?.comments_from);
        this.dateFrom.setDate(this.dateFrom.getDate() - 90);
      }
    }
    else if(typeOfDates == 'processes'){
      if(this.temporalLimitsGraphHQL){
        this.dateTo = new Date(this.temporalLimitsGraphHQL?.participatory_processes_to);
        this.maxDate = new Date(this.temporalLimitsGraphHQL?.participatory_processes_to);
        this.minDate = new Date(this.temporalLimitsGraphHQL?.participatory_processes_from);

        this.dateFrom  = new Date(this.temporalLimitsGraphHQL?.participatory_processes_from);
      }
    }
    this.dateChanged();
    this.ref.detectChanges();
  }

  public dateChanged(): void{

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

  protected abstract processChange(): void;

}

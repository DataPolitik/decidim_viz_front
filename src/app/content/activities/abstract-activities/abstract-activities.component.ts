import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { StatsService } from 'src/app/services/stats.service';


@Component({ template: '' })
export abstract class AbstractActivitiesComponent implements OnInit {
  @Input() public dateFrom: Date = new Date();
  @Input() public dateTo: Date = new Date();

  protected subs = new Subscription();

  public dateFromAsString: string = '';
  public dateToAsString: string = '';

  public isEmpty = true;
  public loadedGraphs: number = 0;

  constructor(protected statsService: StatsService, protected apollo: Apollo){}

  ngOnInit(){

  }

  ngOnChanges(changes: SimpleChanges) {
    this.ngOnInit();
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

}

import { Component, OnInit } from '@angular/core';
import { StatsComponent } from 'src/app/stats/stats.component';

@Component({
  selector: 'app-content-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent extends StatsComponent implements OnInit {
  public dateFrom: Date = new Date();
  public dateTo: Date = new Date();

  public dateFromAsString: string | undefined;
  public dateToAsString: string | undefined;

  override ngOnInit(): void {
    this.dateFrom.setDate(this.dateFrom.getDate() - 90)
  }

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
}
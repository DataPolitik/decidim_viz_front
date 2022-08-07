import { Component, OnInit } from '@angular/core';
import { StatsComponent } from 'src/app/stats/stats.component';

@Component({
  selector: 'app-content-metrics',
  templateUrl: './metrics.component.html',
  styleUrls: ['./metrics.component.css']
})
export class MetricsComponent extends StatsComponent implements OnInit {
  public dateFrom: Date = new Date();
  public dateTo: Date = new Date();
  public isLast90days: boolean = true;


  override ngOnInit(): void {
    this.dateFrom.setDate(this.dateFrom.getDate() - 90)
  }

  public dateChanged(){
    
  }




}

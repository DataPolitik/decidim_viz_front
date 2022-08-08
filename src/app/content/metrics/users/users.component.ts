import { Component, Input, OnInit } from '@angular/core';
import { StatsComponent } from 'src/app/stats/stats.component';

@Component({
  selector: 'app-metrics-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends StatsComponent implements OnInit {
  @Input() dateFromAsString: string = '';
  @Input() dateToAsString: string = '';

  override ngOnInit(): void {
  }

}

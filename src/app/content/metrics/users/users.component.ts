import { Component, Input, OnInit } from '@angular/core';
import { AbstractMetricsComponent } from '../abstract-metrics/abstract-metrics.component';

@Component({
  selector: 'app-metrics-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent extends AbstractMetricsComponent implements OnInit {

  override ngOnInit(): void {
  }

}

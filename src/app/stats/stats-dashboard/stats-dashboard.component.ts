import { Component, Input, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-stats-dashboard',
  templateUrl: './stats-dashboard.component.html',
  styleUrls: ['./stats-dashboard.component.css']
})
export class StatsDashboardComponent<T> implements OnInit {

  @Input() data: Array<T> | undefined = undefined;
  @Input() gini: number | undefined = undefined;
  @Input() title: string | undefined = undefined;
  @Input() countColumnName: string  = '';
  @Input() titleColumn: string  = '';
  @Input() countColumn: string  = '';
  @Input() icon: IconProp | undefined = undefined;
  @Input() isProposal: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import { StatsComponent } from 'src/app/stats/stats.component';

@Component({
  selector: 'app-metrics-participative-processes',
  templateUrl: './participative-processes.component.html',
  styleUrls: ['./participative-processes.component.css']
})
export class ParticipativeProcessesComponent extends StatsComponent implements OnInit {
  @Input() dateFromAsString: string = '';
  @Input() dateToAsString: string = '';


  override ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { StatsComponent } from '../stats/stats.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent extends StatsComponent{}

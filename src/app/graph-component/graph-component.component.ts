import { Component, Input, OnInit } from '@angular/core';
import { LineChart, MarketChart } from '../models/graph.model';
import { StatsService } from '../services/stats.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CONFIGS } from '../config/config.dev';

@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.css']
})
export class GraphComponentComponent implements OnInit {
  public host = CONFIGS.host + ':' + CONFIGS.port;
  public url: any | undefined =  undefined;
  revision = 0;
  htmlOutput: any | undefined = undefined;
  graph: ({ data: (LineChart | MarketChart)[]; layout: { width: number; height: number; title: string; xaxis: { showticklabels: boolean; }; yaxis: { showticklabels: boolean; }; showlegend: boolean; }; } | undefined) = undefined;  @Input() graphTitle: string = '';
  @Input() graphToCall: string = '';

  constructor(private stats: StatsService, private sanitizer:DomSanitizer) { }

  ngOnInit(): void {
    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.host + '/stats/' + this.graphToCall);
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { GraphResponse } from '../models/graph_response.model';
import { StatsService } from '../services/stats.service';
import { buildNetworkFigure, NetworkFigure } from './network-figure';

/** Draws the comments or endorsements network with Plotly, from the back end's JSON. */
@Component({
  selector: 'app-graph-component',
  templateUrl: './graph-component.component.html',
  styleUrls: ['./graph-component.component.css']
})
export class GraphComponentComponent implements OnInit, OnDestroy {
  @Input() graphTitle: string = '';
  /** 'comments' or 'endorsements' */
  @Input() graphToCall: string = '';

  public figure: NetworkFigure | undefined = undefined;
  public failed = false;
  public readonly plotConfig = { displaylogo: false, responsive: true };
  private subscription: Subscription | undefined;

  constructor(private stats: StatsService) { }

  ngOnInit(): void {
    this.subscription = this.stats.getNetwork(this.graphToCall).subscribe({
      next: (network: GraphResponse) => {
        this.figure = buildNetworkFigure(network, this.graphTitle);
      },
      error: () => {
        this.failed = true;
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgChartsAngularModule } from 'ag-charts-angular';

import { HttpClientModule } from '@angular/common/http';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { TabViewModule } from 'primeng/tabview';
import {TableModule} from 'primeng/table';
import { GraphComponentComponent } from './graph-component/graph-component.component';
import { InteractionHistogramComponent } from './histograms/interactions/interaction-histograms.component';
import { StatsComponent } from './stats/stats.component';
import { GraphQLModule } from './graphql.module';
import { HistoryComponent } from './history/history.component';
import { MetricsHistogramComponent } from './histograms/metrics/metrics-histograms.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    GraphComponentComponent,
    InteractionHistogramComponent,
    StatsComponent,
    HistoryComponent,
    MetricsHistogramComponent
  ],
  imports: [
    AgChartsAngularModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PlotlyModule,
    TabViewModule,
    TableModule,
    GraphQLModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

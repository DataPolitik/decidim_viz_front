import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgChartsAngularModule } from 'ag-charts-angular';

import { HttpClientModule } from '@angular/common/http';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { TabViewModule } from 'primeng/tabview';
import { GraphComponentComponent } from './graph-component/graph-component.component';
import { HistogramsComponent } from './histograms/histograms.component';
import { StatsComponent } from './stats/stats.component';
import { GraphQLModule } from './graphql.module';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    GraphComponentComponent,
    HistogramsComponent,
    StatsComponent
  ],
  imports: [
    AgChartsAngularModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PlotlyModule,
    TabViewModule,
    GraphQLModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

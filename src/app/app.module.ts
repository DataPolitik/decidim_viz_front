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
import {TabMenuModule} from 'primeng/tabmenu';
import { MetricsHistogramComponent } from './histograms/metrics/metrics-histograms.component';
import { NavigationMenuComponent } from './header/navigation-menu/navigation-menu.component';
import { DemografiaComponent } from './content/demografia/demografia.component';
import { MetricsComponent } from './content/metrics/metrics.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StillLoadingComponent } from './still-loading/still-loading.component';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    GraphComponentComponent,
    InteractionHistogramComponent,
    StatsComponent,
    MetricsHistogramComponent,
    NavigationMenuComponent,
    DemografiaComponent,
    MetricsComponent,
    StillLoadingComponent
  ],
  imports: [
    AgChartsAngularModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PlotlyModule,
    TabViewModule,
    TableModule,
    TabMenuModule,
    GraphQLModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgChartsAngularModule } from 'ag-charts-angular';

import { HttpClientModule } from '@angular/common/http';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { TabViewModule } from 'primeng/tabview';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { TableModule } from 'primeng/table';
import { GraphComponentComponent } from './graph-component/graph-component.component';
import { InteractionHistogramComponent } from './histograms/interactions/interaction-histograms.component';
import { StatsComponent } from './stats/stats.component';
import { GraphQLModule } from './graphql.module';
import { TabMenuModule } from 'primeng/tabmenu';
import { MetricsHistogramComponent } from './histograms/metrics/metrics-histograms.component';
import { NavigationMenuComponent } from './header/navigation-menu/navigation-menu.component';
import { DemografiaComponent } from './content/demografia/demografia.component';
import { MetricsComponent } from './content/metrics/metrics.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StillLoadingComponent } from './still-loading/still-loading.component';
import { InteractionsComponent } from './interactions/interactions.component';
import { ProposalsComponent } from './content/metrics/proposals/proposals.component';
import { ParticipativeProcessesComponent } from './content/metrics/participative-processes/participative-processes.component';
import { CommentsComponent } from './content/metrics/comments/comments.component';
import { UsersComponent } from './content/metrics/users/users.component';


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
    StillLoadingComponent,
    InteractionsComponent,
    ProposalsComponent,
    ParticipativeProcessesComponent,
    CommentsComponent,
    UsersComponent
  ],
  imports: [
    AgChartsAngularModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CalendarModule,
    CheckboxModule,
    HttpClientModule,
    PlotlyModule,
    TabViewModule,
    TableModule,
    TabMenuModule,
    GraphQLModule,
    FontAwesomeModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

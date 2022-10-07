import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgChartsAngularModule } from 'ag-charts-angular';

import { HttpClientModule, HttpClient } from '@angular/common/http';

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
import { ActivitiesHistogramComponent } from './histograms/activities/activities-histograms.component';
import { NavigationMenuComponent } from './header/navigation-menu/navigation-menu.component';
import { StatsContentComponent } from './content/stats/stats-content.component';
import { ActivitiesComponent } from './content/activities/activities.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StillLoadingComponent } from './still-loading/still-loading.component';
import { InteractionsComponent } from './interactions/interactions.component';
import { ProposalsComponent } from './content/activities/proposals/proposals.component';
import { ParticipativeProcessesComponent } from './content/activities/participative-processes/participative-processes.component';
import { CommentsComponent } from './content/activities/comments/comments.component';
import { MapsComponent } from './maps/maps.component';
import { ProposalsViewerComponent } from './content/proposals-viewer/proposals-viewer.component';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { FooterComponent } from './footer/footer.component';
import {TooltipModule} from 'primeng/tooltip';

import {MenuModule} from 'primeng/menu';
import {DropdownModule} from 'primeng/dropdown';
import { StatsDashboardComponent } from './stats/stats-dashboard/stats-dashboard.component';
import { AboutComponent } from './content/about/about.component';



PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
  declarations: [
    AppComponent,
    GraphComponentComponent,
    InteractionHistogramComponent,
    StatsComponent,
    ActivitiesHistogramComponent,
    NavigationMenuComponent,
    StatsComponent,
    StatsContentComponent,
    ActivitiesComponent,
    StillLoadingComponent,
    InteractionsComponent,
    ProposalsComponent,
    ParticipativeProcessesComponent,
    CommentsComponent,
    MapsComponent,
    ProposalsViewerComponent,
    FooterComponent,
    StatsDashboardComponent,
    AboutComponent
  ],
  imports: [
    AgChartsAngularModule,
    BrowserModule,
    BrowserAnimationsModule,
    DropdownModule,
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
    FormsModule,
    MenuModule,
    TooltipModule,
    TranslateModule.forRoot({
                 loader: {
                     provide: TranslateLoader,
                     useFactory: HttpLoaderFactory,
                    deps: [HttpClient]
                   }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

// required for AOT compilation
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {    return new TranslateHttpLoader(http, './assets/i18n/');}

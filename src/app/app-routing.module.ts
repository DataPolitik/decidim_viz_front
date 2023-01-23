import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './content/activities/activities.component';
import { ProposalsViewerComponent } from './content/proposals-viewer/proposals-viewer.component';
import { InteractionsComponent } from './interactions/interactions.component';
import { AboutComponent } from './content/about/about.component';
import { StatsContentComponent } from './content/stats/stats-content.component';

const routes: Routes = [
  { path: '', component: ActivitiesComponent },
  { path: 'activities', component: ActivitiesComponent, runGuardsAndResolvers: 'always'  },
  { path: 'about', component: AboutComponent , runGuardsAndResolvers: 'always' },
  { path: 'interactions', component: InteractionsComponent , runGuardsAndResolvers: 'always' },
  { path: 'statistics', component: StatsContentComponent, runGuardsAndResolvers: 'always'  },
  { path: 'proposal/:id', component: ProposalsViewerComponent, runGuardsAndResolvers: 'always' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }

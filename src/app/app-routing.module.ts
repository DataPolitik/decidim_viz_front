import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatsContentComponent } from './content/stats/stats-content.component';
import { ActivitiesComponent } from './content/activities/activities.component';
import { ProposalsViewerComponent } from './content/proposals-viewer/proposals-viewer.component';
import { InteractionsComponent } from './interactions/interactions.component';
import { AboutComponent } from './content/about/about.component';

const routes: Routes = [
  { path: '', component: ActivitiesComponent },
  { path: 'activities', component: ActivitiesComponent },
  { path: 'stats', component: StatsContentComponent },
  { path: 'about', component: AboutComponent },
  { path: 'interacciones', component: InteractionsComponent },
  { path: 'proposal/:id', component: ProposalsViewerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

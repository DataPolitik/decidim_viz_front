import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StatsContentComponent } from './content/stats/stats-content.component';
import { ActivitiesComponent } from './content/activities/activities.component';
import { ProposalsViewerComponent } from './content/proposals-viewer/proposals-viewer.component';
import { InteractionsComponent } from './interactions/interactions.component';

const routes: Routes = [
  { path: '', component: StatsContentComponent },
  { path: 'stats', component: StatsContentComponent },
  { path: 'activities', component: ActivitiesComponent },
  { path: 'interacciones', component: InteractionsComponent },
  { path: 'proposal/:id', component: ProposalsViewerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemografiaComponent } from './content/demografia/demografia.component';
import { ActivitiesComponent } from './content/activities/activities.component';
import { ProposalsViewerComponent } from './content/proposals-viewer/proposals-viewer.component';
import { InteractionsComponent } from './interactions/interactions.component';

const routes: Routes = [
  { path: '', component: DemografiaComponent },
  { path: 'demografia', component: DemografiaComponent },
  { path: 'metricas', component: ActivitiesComponent },
  { path: 'interacciones', component: InteractionsComponent },
  { path: 'proposal/:id', component: ProposalsViewerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

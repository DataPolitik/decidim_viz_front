import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemografiaComponent } from './content/demografia/demografia.component';
import { MetricsComponent } from './content/metrics/metrics.component';
import { InteractionsComponent } from './interactions/interactions.component';

const routes: Routes = [
  { path: '', component: DemografiaComponent },
  { path: 'demografia', component: DemografiaComponent },
  { path: 'metricas', component: MetricsComponent },
  { path: 'interacciones', component: InteractionsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemografiaComponent } from './content/demografia/demografia.component';
import { MetricsComponent } from './content/metrics/metrics.component';

const routes: Routes = [
  { path: '', component: DemografiaComponent },
  { path: 'demografia', component: DemografiaComponent },
  { path: 'metricas', component: MetricsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemografiaComponent } from './content/demografia/demografia.component';
import { InteraccionesComponent } from './content/interacciones/interacciones.component';

const routes: Routes = [
  { path: '', component: DemografiaComponent },
  { path: 'demografia', component: DemografiaComponent },
  { path: 'interacciones', component: InteraccionesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

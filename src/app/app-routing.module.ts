import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './components/main/main.component';
import { StatsComponent } from './components/stats/stats.component';
import { UserComponent } from './components/user/user.component';
import { SeriesComponent } from './components/series/series.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'stats/:id',
    component: UserComponent,
    children: [
      { path: 'overview', component: StatsComponent },
      { path: 'series', component: SeriesComponent }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

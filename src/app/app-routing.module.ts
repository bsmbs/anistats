import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { StatsComponent } from './stats/stats.component';
import { UserComponent } from './user/user.component';
import { SeriesComponent } from './series/series.component';


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
      { path: 'series', redirectTo: 'series/', pathMatch: 'full' },
      { path: 'series/:seriesId', component: SeriesComponent },

    ],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { StatsComponent } from './stats/stats.component';
import { MonthPipe } from './month.pipe';
import { ChartComponent } from './chart/chart.component';
import { UserComponent } from './user/user.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { SeriesComponent } from './series/series.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ItemComponent } from './list/item/item.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    StatsComponent,
    MonthPipe,
    ChartComponent,
    UserComponent,
    SpinnerComponent,
    SeriesComponent,
    CalendarComponent,
    ItemComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

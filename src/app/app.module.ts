import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { StatsComponent } from './components/stats/stats.component';
import { ChartComponent } from './components/chart/chart.component';
import { UserComponent } from './components/user/user.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { SeriesComponent } from './components/series/series.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ItemComponent } from './components/list/item/item.component';
import { DayPopupComponent } from './components/popup/day-popup/day-popup.component';
import { PopupComponent } from './components/popup/popup.component';

import { MonthPipe } from './pipes/month.pipe';
import { SeriesItemComponent } from './components/list/series-item/series-item.component';
import { AnimetypePipe } from './pipes/animetype.pipe';
import { FilterComponent } from './components/list/filter/filter.component';

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
    ItemComponent,
    DayPopupComponent,
    PopupComponent,
    SeriesItemComponent,
    AnimetypePipe,
    FilterComponent,
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

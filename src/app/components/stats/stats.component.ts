import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { activityDateFromDate, ActivityDay, FormattedActivity } from '../../interfaces/activity-day';
import { StatsService } from '../../services/stats.service';
import { UserService } from '../../services/user.service';

import { MonthPipe } from '../../pipes/month.pipe';
import { PopupComponent } from '../popup/popup.component';
import { LocaleService } from 'src/app/services/locale.service';
import { DayData } from '../calendar/calendar.component';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  providers: [MonthPipe]
})
export class StatsComponent implements OnInit {
  @ViewChild('popup') popup: PopupComponent;

  activities: FormattedActivity[];

  updating: Subject<number> = new Subject();

  loading: boolean = true;
  pickMode: boolean = false;

  constructor(private route: ActivatedRoute, private router: Router, private user: UserService, public statsService: StatsService, private monthPipe: MonthPipe, public locale: LocaleService) {
    if (!this.statsService.prefetchedActivities) { // first time
      this.statsService.fetchActivity(1)
        .then(async resp => {
          this.statsService.activities = this.statsService.parseActivities(resp.data.data.Page.activities);
          await this.statsService.prefetch();

          this.activities = this.formatActivities(this.statsService.activities).reverse();

          if(this.activities.length == 0) {
            // todo some fancy error message
            this.router.navigateByUrl('/');
            alert("Sorry, anistats can't access this account because it's private or has no activity")
          }

          this.loading = false;
        })
    } else {
      this.activities = this.formatActivities(this.statsService.activities).reverse();
      this.loading = false;
    }
  }

  formatActivities(a: ActivityDay[]): FormattedActivity[] {
    return a.map(x => ({
      ...x,
      topText: this.locale.formatActivityDate(x.day),
      bottomText: x.day.weekday
    }));
  }

  handleCalendar(event: FormattedActivity | number | DayData ) {
    if(typeof event == 'number') {
      switch(event) {
        case 1: // month --
          this.calendarBack();
          break;
        case 2: // month ++
          this.calendarForward();
          break;
      }
    } else if ((<DayData>event).year) { 
      if(this.pickMode) { // Load specific day and show popup
        let d = (<DayData>event);
        let date = new Date(d.year, d.month, d.day);

        // Get timestamp of the beginning and the end of this day
        // Add 3 hours because of late evenings counting as previous day.
        const begin = date.getTime()+10800000;
        const end = begin+86400000; // add 24 hours to the beginning

        // Fetch user activities from this day from Anilist
        this.statsService.fetchSpecificDayActivity(begin/1000, end/1000)
        .then(resp => {
          // Parse
          const parsed = this.statsService.parseActivities(resp.data.data.Page.activities);

          const formatted = this.formatActivities(parsed);


          /*if(formatted.length > 1) {
            let nf = formatted[0];
            nf.eps += formatted[1].eps;
            nf.anime = nf.anime.concat(formatted[1].anime);

            this.popup.openDay(nf);
          } else {*/
            this.popup.openDay(formatted[0]);
          //}
        });
      } else { // Load earlier
        this.loadEarlier();
      }
    } else {
      // Open dayPopup
      this.popup.openDay(<FormattedActivity>event);
    }
  }

  get todayEpisodes() {
    const now = new Date();
    const acdNow = activityDateFromDate(now);

    const match = this.activities.find(x => this.statsService.compareDates(acdNow, x.day));
    return (match ? match.eps : 0);
  }

  get weekEpisodes() {
    const now = new Date();
    now.setDate(now.getDate() - 6);

    const r = this.activities
    .filter(x => x.day.time > now.getTime())
    .map(x => x.eps)
    if (r.length > 0) return r.reduce((a, b) => a + b);
    else return 0;
  }

  get average() {
    const sum = this.activities
    .map(x => x.eps)
    .reduce((a, b) => a + b);

    const now = new Date();
    const last = this.activities[0].day.time;

    const diff = Math.ceil(Math.abs(last - now.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return (sum / diff).toFixed(2);
  }

  async loadEarlier() {
    if(this.statsService.lock) return;
    this.updating.next(0); // SIGNAL: LOADING START

    await this.statsService.loadEarlier();

    this.activities = this.formatActivities(this.statsService.activities).reverse();
    this.updating.next(1); // SIGNAL: LOADING COMPLETE
  }

  more(id: number) {
    this.router.navigate(['series', id], { relativeTo: this.route.parent});
  }

  // CALENDAR FUNCTIONS
  calendarBack(): void {
    this.updating.next(3); // Signal: MONTH--
  }

  calendarForward(): void {
    this.updating.next(2); // Signal: MONTH++
  }

  togglePickMode(): void {
    this.pickMode = !this.pickMode;
  }

  ngOnInit(): void {

  }

}

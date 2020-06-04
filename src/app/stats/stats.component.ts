import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StatsService } from './stats.service';
import { UserService } from '../user/user.service';
import { MonthPipe } from '../month.pipe';
import { Subject } from 'rxjs';
import { activityDateFromDate, ActivityDay, FormattedActivity, ActivityDate } from '../activity-day';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  providers: [MonthPipe]
})
export class StatsComponent implements OnInit {
  todayIndex: number = 0;
  activities: FormattedActivity[];

  updating: Subject<number> = new Subject();

  loading: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private user: UserService, public statsService: StatsService, private monthPipe: MonthPipe) {
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
      topText: x.day.date + '.' + this.monthPipe.transform(x.day.month) + '.' + x.day.year,
      bottomText: x.day.weekday
    }));
  }

  handleCalendar(event: ActivityDate | number) {
    if(typeof event == 'number') {
      this.loadEarlier();
    } else {
      console.log("work");
    }
  }

  get today() {
    return this.activities[this.todayIndex].anime.map(x => ({
      ...x,
      topText: x.title,
      bottomImage: true,
      bottomText: x.image
    })).sort((a, b) => a.eps - b.eps);
  }

  get todayDate() {
    const ob = this.activities[this.todayIndex];
    return {
      day: ob.day,
      formatted: ob.topText,
      formattedWeekday: ob.bottomText
    };
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

  todayMove(pos) {
    if (this.todayIndex + pos < 0 || this.todayIndex + pos >= this.activities.length) return;
    this.todayIndex += pos;
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

  ngOnInit(): void {

  }

}

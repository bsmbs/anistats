import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StatsService } from './stats.service';
import { UserService } from '../user/user.service';
import { MonthPipe } from '../month.pipe';
import { Subject } from 'rxjs';
import { activityDateFromDate } from '../activity-day';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss'],
  providers: [MonthPipe]
})
export class StatsComponent implements OnInit {
  todayIndex: number = 0;

  movingValue: Subject<number> = new Subject();
  movingToday: Subject<number> = new Subject();

  loading: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private user: UserService, public statsService: StatsService, private monthPipe: MonthPipe) {
    if (!this.statsService.prefetchedActivities) { // first time
      this.statsService.fetchActivity(1)
        .then(async resp => {
          this.statsService.activities = this.statsService.parseActivities(resp.data.data.Page.activities);
          await this.statsService.prefetch();

          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  get activities() {
    return this.statsService.activities.map(x => ({
      ...x,
      topText: x.day.date + '.' + this.monthPipe.transform(x.day.month) + '.' + x.day.year,
      bottomText: x.day.weekday
    }));
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

    return this.activities
    .filter(x => x.day.time > now.getTime())
    .map(x => x.eps)
    .reduce((a, b) => a + b);
  }

  get average() {
    const sum = this.activities
    .map(x => x.eps)
    .reduce((a, b) => a + b);

    const now = new Date();
    const last = this.activities[this.activities.length-1].day.time;

    const diff = Math.ceil(Math.abs(last - now.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return (sum / diff).toFixed(2);
  }

  move(val: number) {
    this.movingValue.next(val);
  }

  todayMove(pos) {
    if (this.todayIndex + pos < 0 || this.todayIndex + pos >= this.activities.length) return;
    this.todayIndex += pos;
  }

  loadEarlier() {
    this.statsService.loadEarlier();
  }

  more(id: number) {
    this.router.navigate(['series', id], { relativeTo: this.route.parent});
  }

  ngOnInit(): void {

  }

}

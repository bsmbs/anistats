import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';

import { ActivityDay, stringFromDate } from '../../activity-day';
import { MonthPipe } from '../../pipes/month.pipe';

import { SeriesService, Media } from '../../services/series.service';
import { StatsService } from '../../services/stats.service';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
  providers: [MonthPipe]
})
export class SeriesComponent implements OnInit {
  list: Media[];

  hidden: boolean = false;
  mobile: boolean = false;
  loading: boolean = false;

  current: ActivityDay[];
  currentData: {
    id: number,
    image: string,
    banner: string,
    title: string,
    episodes: number,
    first?: string,
    last?: string,
    planning?: string,
    diff?: number,
    avg?: number,
  }

  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute, private router: Router, private seriesService: SeriesService, private statsSerivce: StatsService, private monthPipe: MonthPipe) { }

  async ngOnInit() {
    if (typeof this.seriesService.list == 'undefined') await this.seriesService.getList();
    this.route.params.subscribe(params => {
      window.scrollTo(0, 0);
      if (params.seriesId.length > 0) {
        this.loading = true;
        this.select(params.seriesId);
      }
    });

    this.list = this.seriesService.list;

    this.breakpointObserver
    .observe(['(min-width: 1024px)'])
    .subscribe((state: BreakpointState) => {
      this.mobile = !state.matches;
    });
  }

  onSearch(e) {
    this.list = this.seriesService.list.filter(item => item.title.romaji.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1);
  }

  go(id: number) {
    delete this.current;
    this.loading = true;
    this.router.navigate(['series', id], { relativeTo: this.route.parent });
  }

  select(id: number) {
    this.hidden = true;
    this.seriesService.fetchMedia(id)
    .then(r => {
      let plan = r.Page.activities.find(act => act.status == 'plans to watch');

      this.current = this.statsSerivce.parseActivities(r.Page.activities);
      this.loading = false;

      if (this.current.length == 0) {
        this.currentData = {
          id: r.Media.id,
          image: r.Media.coverImage.large,
          title: r.Media.title.romaji,
          banner: r.Media.bannerImage,
          episodes: r.Media.episodes,
        };
        return;
      }
      const first = this.current[this.current.length - 1];
      const last = this.current[0];
      const diff = Math.ceil(Math.abs(last.day.time - first.day.time) / (1000 * 60 * 60 * 24)) + 1;
      const avg = +(this.current.map(x => x.eps).reduce((a, b) => a + b) / this.current.length).toFixed(1);

      this.currentData = {
        id: r.Media.id,
        image: r.Media.coverImage.large,
        title: r.Media.title.romaji,
        banner: r.Media.bannerImage,
        episodes: r.Media.episodes,
        first: first.day.date + '.' + this.monthPipe.transform(first.day.month) + '.' + first.day.year,
        last: last.day.date + '.' + this.monthPipe.transform(last.day.month) + '.' + last.day.year,
        planning: (plan ? stringFromDate(new Date(plan.createdAt * 1000)) : ''),
        diff,
        avg
      };
    });
  }

  switch() {
    this.hidden = !this.hidden;
  }

  get chartData() {
    return this.current.map(x => ({
      ...x,
      topText: x.day.date + '.' + this.monthPipe.transform(x.day.month) + '.' + x.day.year,
      bottomText: x.day.weekday
    }));
  }

}

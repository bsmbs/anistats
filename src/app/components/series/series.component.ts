import { Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';

import { MonthPipe } from '../../pipes/month.pipe';
import { Filter } from '../../interfaces/filters';

import { SeriesService, Media } from '../../services/series.service';
import { StatsService } from '../../services/stats.service';
import { PopupComponent } from '../popup/popup.component';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss'],
  providers: [MonthPipe]
})
export class SeriesComponent implements OnInit {
  @ViewChild('popup') popup: PopupComponent;

  list: Media[];
  val: string = '';

  sortSettings: {
    prop: string;
    descending: boolean; // false: ascending, true: descending
  } = {
    prop: 'title',
    descending: false
  }

  filters: Filter[] = [
    {
      name: 'Status',
      key: 'status',
      values: [
        {
          name: "Watching",
          key: "CURRENT"
        },
        {
          name: "Rewatching",
          key: "REPEATING"
        },
        {
          name: "Completed",
          key: "COMPLETED"
        },
        {
          name: "Planning",
          key: "PLANNING"
        },
        {
          name: "Dropped",
          key: "DROPPED"
        },
        {
          name: "Paused",
          key: "PAUSED"
        }
      ],
      checked: ["COMPLETED"]
    }
  ]

  /*hidden: boolean = false;
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
  }*/

  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute, private router: Router, private seriesService: SeriesService, private statsSerivce: StatsService, private monthPipe: MonthPipe) { }

  async ngOnInit() {
    this.seriesService.ensureList()
    .then(list => {
      this.list = Object.create(list);
      console.dir(list);
    })
    /*if (typeof this.seriesService.list == 'undefined') await this.seriesService.getList();
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
    });*/
  }

  sort(prop: string) {
    if(this.sortSettings.prop == prop) { this.list.reverse(); this.sortSettings.descending = !this.sortSettings.descending; return; /* TODO reverse */ }

    this.sortSettings.prop = prop;
    this.sortSettings.descending = false;

    if(prop == 'added') this.list.sort((a, b) => a.added.time - b.added.time);
    else this.list.sort((a, b) => a[prop].localeCompare(b[prop]));
    //this.list[0]['added'].time
  }

  get filteredList(): Media[] {
    let filtered = this.list;
    this.filters.forEach(f => {
      filtered = filtered.filter(x => f.checked.indexOf(x[f.key]) > -1);
    })

    filtered = filtered.filter(item => item.title.toLowerCase().indexOf(this.val.toLowerCase()) > -1);

    return filtered;
  }

  pop(a: Media) {
    this.popup.openSeries(a);
  }

  /*select(id: number) {
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
*/


  /*get chartData() {
    return this.current.map(x => ({
      ...x,
      topText: x.day.date + '.' + this.monthPipe.transform(x.day.month) + '.' + x.day.year,
      bottomText: x.day.weekday
    }));
  }*/

}

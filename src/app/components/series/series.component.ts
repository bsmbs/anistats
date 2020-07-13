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

  showFilters: boolean = true;

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

  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute, private router: Router, private seriesService: SeriesService, private statsSerivce: StatsService, private monthPipe: MonthPipe) { }

  async ngOnInit() {
    this.seriesService.ensureList()
    .then(list => {
      this.list = Object.create(list);
    })
  }

  sort(prop: string) {
    if(this.sortSettings.prop == prop) { this.list.reverse(); this.sortSettings.descending = !this.sortSettings.descending; return; /* TODO reverse */ }

    this.sortSettings.prop = prop;
    this.sortSettings.descending = false;

    if(prop == 'added') this.list.sort((a, b) => a.added.time - b.added.time);
    else this.list.sort((a, b) => a[prop].localeCompare(b[prop]));

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

  switchFilters() {
    this.showFilters = !this.showFilters;
  }

}

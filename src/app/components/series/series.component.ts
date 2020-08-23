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
      name: "Year",
      key: "seasonYear",
      type: "RANGE",
      min: 1950,
      max: new Date().getFullYear(),
      checked: "any"
    },
    {
      name: 'Status',
      key: 'status',
      type: "INCLUSION",
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
      checked: ["COMPLETED", "CURRENT", "REPEATING"]
    },
    {
      name: "Episodes",
      key: "episodes",
      type: "RANGE",
      min: 1,
      max: 80,
      checked: "any"
    },
    {
      name: "Type",
      key: "format",
      type: "INCLUSION",
      values: [
        {
          name: "TV",
          key: "TV"
        },
        {
          name: "TV Short",
          key: "TV_SHORT"
        },
        {
          name: "Movie",
          key: "MOVIE"
        },
        {
          name: "Special",
          key: "SPECIAL"
        },
        {
          name: "OVA",
          key: "OVA"
        },
        {
          name: "ONA",
          key: "ONA"
        },
        {
          name: "Music",
          key: "MUSIC"
        }
      ],
      checked: ["TV", "TV_SHORT", "MOVIE", "SPECIAL", "OVA", "ONA", "MUSIC"]
    }
  ]

  constructor(private breakpointObserver: BreakpointObserver, private route: ActivatedRoute, private router: Router, private seriesService: SeriesService, private statsSerivce: StatsService, private monthPipe: MonthPipe) { }

  async ngOnInit() {
    this.seriesService.ensureList()
    .then(list => {
      this.list = Object.create(list);
      console.dir(this.list[0])
    })
  }

  sort(prop: string) {
    if(this.sortSettings.prop == prop) { this.list.reverse(); this.sortSettings.descending = !this.sortSettings.descending; return; }

    this.sortSettings.prop = prop;
    this.sortSettings.descending = false;

    if(prop == 'added') this.list.sort((a, b) => a.added.time - b.added.time);
    else this.list.sort((a, b) => {
      if(typeof a[prop] != 'string' || typeof b[prop] != 'string') return -1;
      return a[prop].localeCompare(b[prop]);
    });

  }

  get filteredList(): Media[] {
    let filtered = this.list;
    this.filters.forEach(f => {
      switch(f.type) {
        case 'INCLUSION':
          filtered = filtered.filter(x => f.checked.indexOf(x[f.key]) > -1);
          break;
        case 'RANGE':
          if(f.checked == 'any') break;
          filtered = filtered.filter(x => f.checked == x[f.key])
          break;
      }
    })

    // Search
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

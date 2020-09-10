import { Component, OnInit } from '@angular/core';
import { Filter } from 'src/app/interfaces/filters';
import { SeriesService, Media } from 'src/app/services/series.service';

interface Filters {
  name: string,
  key: string,
  min: number,
  max: number,
  currentMin: number,
  currentMax: number,
  unit?: string,
  maxUnit?: string
}

@Component({
  selector: 'app-random',
  templateUrl: './random.component.html',
  styleUrls: ['./random.component.scss']
})
export class RandomComponent implements OnInit {
  minScore: number = 0;
  maxScore: number = 100;

  minEps: number = 0;
  maxEps: number = 80;

  minYear: number = 1950;

  currentYear: number = new Date().getFullYear();
  maxYear: number = this.currentYear;

  randomed: Media;
  randomizing: boolean = false;

  filters: Filters[] = [
    {
      name: "Average score",
      key: 'averageScore',
      min: 0,
      max: 100,
      currentMin: 0,
      currentMax: 100,
      unit: '%'
    },
    {
      name: "Episodes",
      key: 'episodes',
      min: 0,
      max: 80,
      currentMin: 0,
      currentMax: 80,
      maxUnit: '+'
    },
    {
      name: "Year",
      key: 'seasonYear',
      min: 1950,
      max: this.currentYear,
      currentMin: 1950,
      currentMax: this.currentYear
    }
  ]

  format: Filter = {
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

  constructor(private seriesService: SeriesService) { }

  ngOnInit(): void {
  }

  select() {
    this.randomizing = true;

    this.seriesService.ensureList()
    .then(list => {
      let filtered = list.filter(x => this.format.checked.indexOf(x.format) > -1 && x.status == 'PLANNING');
      // todo fix entries that don't have a release year specified
      this.filters.forEach(f => {
        filtered = filtered.filter(x => x[f.key] >= f.currentMin && x[f.key] <= f.currentMax);
      })
      
      this.randomizing = false;

      if(filtered.length == 0) {
        alert('No matching entries found');
        return;
      }

      const r = filtered[Math.floor(Math.random() * filtered.length)];
      this.randomed = r;
    })
  }

}

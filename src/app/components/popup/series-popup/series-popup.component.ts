import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Media, SeriesService } from 'src/app/services/series.service';
import { StatsService } from 'src/app/services/stats.service';
import { ActivityDay } from 'src/app/interfaces/activity-day';
import { MonthPipe } from 'src/app/pipes/month.pipe';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-series-popup',
  templateUrl: './series-popup.component.html',
  styleUrls: ['./series-popup.component.scss'],
  providers: [MonthPipe],
  animations: [
    trigger(
      'w', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('400ms ease-in-out', style({ opacity: 1 }))
        ])
      ]
    )
  ]
})
export class SeriesPopupComponent implements OnInit {
  @Input() data: Media;
  @Output() close = new EventEmitter();

  current: ActivityDay[];
  nodata: boolean = false;

  constructor(private seriesService: SeriesService, private statsService: StatsService, private monthPipe: MonthPipe) { }

  ngOnInit(): void {
    console.log("a");
    this.load(this.data.id);
  }

  closePopup(): void {
    this.close.next();
  }

  load(i: number) {
    this.seriesService.fetchMedia(i)
    .then(r => {
      this.current = this.statsService.parseActivities(r.Page.activities)
      .map(x => ({
        ...x,
        topText: x.day.date + '.' + this.monthPipe.transform(x.day.month) + '.' + x.day.year, // TODO: date localization
        bottomText: x.day.weekday
      })).reverse();

      if(this.current.length == 0) {
        this.nodata = true;
      }
    })
  }
}

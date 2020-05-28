import { Component, OnInit, Input } from '@angular/core';
import { ActivityDay } from '../activity-day';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  @Input() data: ActivityDay[];
  @Input() update?: Subject<boolean>;
  
  monthDays: number = 0;
  firstWeekday: number = 0;
  maxEps: number = 0;

  days = [];

  constructor() { }

  ngOnInit(): void {
    this.update.subscribe(v => {
      console.log("u")
      this.days.length = 0;
      this.loadMonth(4, 2020)
    })
  }

  loadMonth(month, year) {  
    let firstDay = new Date(year, month, 1);
    this.firstWeekday = firstDay.getDay();

    let monthDays = this.daysInMonth(month, year);

    this.maxEps = Math.max.apply(Math, this.data.map(x => x.eps));

    for (let i = 1; i <= monthDays; i++) {
      let ad = this.data.find(x => x.day.date == i && x.day.month == month+1 && x.day.year == year);
        this.days.push({
          day: i,
          eps: (ad ? ad.eps : 0)
        });
    }
  }
  
  dColor(eps) {
    let r = eps/this.maxEps;

    //return r;

    switch(true) {
      case (r < 0.2):
        return '0.25';
      case (r < 0.4):
        return '0.4';
      case (r < 0.7):
        return '0.7';
      default:
        return '1';
    }
  }

  daysInMonth(m, y) {
    switch (m) {
        case 1 :
            return (y % 4 == 0 && y % 100) || y % 400 == 0 ? 29 : 28;
        case 8 : case 3 : case 5 : case 10 :
            return 30;
        default :
            return 31
    }
  }

}

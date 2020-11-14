import { Component, EventEmitter, OnInit, Input, OnChanges, Output } from '@angular/core';
import { Subject } from 'rxjs';

import { StatsService } from '../../services/stats.service';
import { FormattedActivity, FuzzyDate } from '../../interfaces/activity-day';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit, OnChanges {
  @Input() data: FormattedActivity[];
  @Input() update?: Subject<number>;
  @Output() events = new EventEmitter<FormattedActivity|number|FuzzyDate>()
  
  initialX: number;

  monthDays: number = 0;
  firstWeekday: number = 0;
  lastDay: number = 0;

  maxEps: number = 0;

  currentMonth: number = 0;
  currentYear: number = 2020;

  days = [];

  constructor(private statsSerivce: StatsService) { 
    const now = new Date();
    this.currentMonth = now.getMonth();
    this.currentYear = now.getFullYear();
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes) {
    if(changes["data"] && this.data) {
        this.loadMonth(this.currentMonth, this.currentYear);
    }

    if(changes["update"] && this.update) {
      
      this.update.subscribe(v => {
        switch(v) {
          case 2: // MONTH++
            if(this.currentMonth+1 > 11) {
              this.currentYear++;
              this.currentMonth = -1;
            }

            this.currentMonth++;
            this.loadMonth(this.currentMonth, this.currentYear);
            break;
          case 3: // MONTH--
            if(this.currentMonth-1 < 0) {
              this.currentYear--
              this.currentMonth = 12;
            };

            this.currentMonth--;
            this.loadMonth(this.currentMonth, this.currentYear);
            break;
        }
      })
    }
  }

  loadMonth(month, year) {
    // Clear current display
    this.days.length = 0;
    this.lastDay = 0;

    let firstDay = new Date(year, month, 1);
    this.firstWeekday = firstDay.getDay();
    if(this.firstWeekday == 0) this.firstWeekday = 7;

    this.statsSerivce.calendarDisplay.month = new Intl.DateTimeFormat('default', { month: 'long' }).format(firstDay);
    this.statsSerivce.calendarDisplay.year = year;

    let monthDays = this.daysInMonth(month, year);

    this.maxEps = Math.max.apply(Math, this.data.map(x => x.eps));

    const lastActivity = this.data[0].day;
    if(lastActivity.month == month+1 && lastActivity.year == year) {
      this.lastDay = lastActivity.date
    } else if (month+1 < lastActivity.month && lastActivity.year == year) {
      this.lastDay = 100;
    } else if (year < lastActivity.year) {
      this.lastDay = 100;
    }
    
    for (let i = 1; i <= monthDays; i++) {
      let ad = this.data.find(x => x.day.date == i && x.day.month == month+1 && x.day.year == year);
        this.days.push({
          day: i,
          dayObj: ad,
          is: (!ad && i < this.lastDay ? false : true),
          eps: (ad ? ad.eps : 0)
        });
    }
  }
  
  handleClick(day) {
    if(day.dayObj) {
      this.events.emit(day.dayObj);
    } else if (!day.is) {
      this.events.emit({
        day: day.day,
        month: this.currentMonth,
        year: this.currentYear
      })
    }
  }

  dColor(eps) {
    let r = eps/this.maxEps;

    //return r;
    if (r == 0) return 0;
    else if (r < 0.15) return 0.15;
    else return r;
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

  // Swipe methods
  swipeStart(e: TouchEvent) {
    this.initialX = e.touches[0].clientX;
  }

  swipeEnd(e: TouchEvent) {
    const currentX = e.changedTouches[0].clientX;
    const diff = this.initialX - currentX;

    if(diff > 70) { // Swiped left, month forward
      this.events.emit(2);
    } else if (diff < -70) { // Swiped right, month back
      this.events.emit(1);
    }
  }
}

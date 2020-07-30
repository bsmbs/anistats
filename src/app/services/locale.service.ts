import { Injectable } from '@angular/core';
import { ActivityDate, activityDateFromDate } from '../interfaces/activity-day';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {
  // TODO move ActivityDate parsing functions here
  dateFormat: string;

  constructor() { 
    this.dateFormat = this.localDateFormat();
  }

  localDateFormat() {
    const formatObj = new Intl.DateTimeFormat().formatToParts(new Date());
    
    return formatObj
      .map(obj => {
        switch (obj.type) {
          case "day":
            return "DD";
          case "month":
            return "MM";
          case "year":
            return "YYYY";
          default:
            return obj.value;
        }
      })
      .join("");

  }

  formatActivityDate(d: ActivityDate): string {
    //@ts-ignore
    return this.dateFormat.replace("DD", d.date).replace("MM", (d.month >= 10 ? d.month : '0'+d.month )).replace("YYYY", d.year); 
  }

  formatDate(d: Date): string {
    return this.formatActivityDate(activityDateFromDate(d));
  }
}

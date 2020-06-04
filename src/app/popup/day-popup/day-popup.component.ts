import { Component, OnInit, Input } from '@angular/core';
import { FormattedActivity } from 'src/app/activity-day';

@Component({
  selector: 'app-day-popup',
  templateUrl: './day-popup.component.html',
  styleUrls: ['./day-popup.component.scss']
})
export class DayPopupComponent implements OnInit {
  @Input() data: FormattedActivity;

  constructor() { }

  ngOnInit(): void {
    //this.data.
  }

}

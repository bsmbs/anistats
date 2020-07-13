import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormattedActivity } from 'src/app/interfaces/activity-day';
import { Media } from 'src/app/services/series.service';

@Component({
  selector: 'app-day-popup',
  templateUrl: './day-popup.component.html',
  styleUrls: ['./day-popup.component.scss']
})
export class DayPopupComponent implements OnInit {
  @Output() close = new EventEmitter();
  @Output() switch: EventEmitter<Media> = new EventEmitter();

  @Input() data: FormattedActivity;

  constructor() { }

  ngOnInit(): void {
  }

  closePopup(): void {
    this.close.next();
  }

}

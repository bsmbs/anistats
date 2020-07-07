import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormattedActivity } from '../../interfaces/activity-day';
import { Media } from 'src/app/services/series.service';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  animations: [
    trigger(
      'pop', [
        transition(':enter', [
          style({ marginBottom: '-50vw', opacity: 0 }),
          animate('300ms ease', style({ marginBottom: 0, opacity: 1 }))
        ]),
        transition(':leave', [
          animate('200ms ease-in-out', style({ opacity: 0, marginBottom: '-50vw' }))
        ])
      ]
    )
  ]
})
export class PopupComponent implements OnInit {
  isOpen: boolean = false;
  data: FormattedActivity;
  seriesdata: Media;

  mode: number = 0; // 0: day, 1: series

  constructor() { }

  ngOnInit(): void {
  }

  get sdata() {
    this.data.anime.sort((a, b) => b.eps - a.eps);
    return this.data;
  }

  close(): void {
    this.isOpen = false;
  }

  open(): void {
    this.isOpen = true;
  }

  openDay(e: FormattedActivity): void {
    this.mode = 0;
    this.isOpen = true;
    this.data = e;
  }

  openSeries(e: Media): void {
    this.mode = 1;
    this.isOpen = true;
    this.seriesdata = e;
  }
}

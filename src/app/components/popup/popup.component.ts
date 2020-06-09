import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormattedActivity } from '../../activity-day';

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
    this.isOpen = true;
    this.data = e;
  }
}

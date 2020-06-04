import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormattedActivity } from '../activity-day';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  animations: [
    trigger(
      'pop', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('200ms ease-out', style({ opacity: 1}))
        ]),
        transition(':leave', [
          animate('200ms ease-out', style({ opacity: 0 }))
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

import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { FormattedActivity } from '../activity-day';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  animations: [
    trigger(
      'loadingAnimation', [
        transition(':enter', [
          style({ opacity: 0}),
          animate('200ms', style({ opacity: 1 }))
        ]),
        transition(':leave', [
          animate('200ms', style({ opacity: 0 }))
        ])
      ]
    )
  ]
})
export class ChartComponent implements OnChanges, OnInit {
  @Input() data: FormattedActivity[];
  @Input() update: Subject<number>;

  @ViewChild('chartel') chartel: ElementRef;

  loading: boolean = false;

  maxEps: number;
  isDown: boolean;
  startX: number;
  scrollLeft: number;
  pos: number;
  offsetRight: number;

  constructor() {
    //
   }

  ngOnInit() {

  }

  ngOnChanges(changes): void {
    if(changes["update"] && this.update) {
    this.update.subscribe(state => {
        switch(state) {
          case 0:
            this.offsetRight = this.chartel.nativeElement.scrollWidth - this.chartel.nativeElement.scrollLeft - this.chartel.nativeElement.clientWidth;
            this.loading = true;
            break;
          case 1:
            setTimeout(() => {
              this.chartel.nativeElement.scrollLeft = this.chartel.nativeElement.scrollWidth - this.chartel.nativeElement.clientWidth - this.offsetRight;
            }, 0)
            this.loading = false;
            break;
        }
      })
    }
    
    this.maxEps = Math.max.apply(Math, this.data.map(x => x.eps));
  }

  move(e): void {
    if (!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this.chartel.nativeElement.offsetLeft;
    const walk = (x - this.startX) * 1.2;
    this.chartel.nativeElement.scrollLeft = this.scrollLeft - walk;
  }

  up(e): void {
    this.pos = this.chartel.nativeElement.offsetLeft;
    this.isDown = false;
  }

  down(e): void {
    this.isDown = true;
    this.startX = e.pageX - this.chartel.nativeElement.offsetLeft;
    this.scrollLeft = this.chartel.nativeElement.scrollLeft;
  }

}

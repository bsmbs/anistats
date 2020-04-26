import { Component, OnInit, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnChanges, OnInit {
  @Input() data;
  @Input() moving: Subject<number>;

  @ViewChild('chartel') chartel: ElementRef;

  maxEps: number;
  isDown: boolean;
  startX: number;
  scrollLeft: number;
  pos: number;

  constructor() {
    //
   }

  ngOnInit() {
    this.moving.subscribe(v => {
      this.chartel.nativeElement.scrollBy({
        left: v,
        behavior: 'smooth'
      })
    })
  }

  ngOnChanges(): void {
    this.maxEps = Math.max.apply(Math, this.data.map(x => x.eps));
  }

  move(e): void {
    if(!this.isDown) return;
    e.preventDefault();
    const x = e.pageX - this.chartel.nativeElement.offsetLeft;
    const walk = (x - this.startX);
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

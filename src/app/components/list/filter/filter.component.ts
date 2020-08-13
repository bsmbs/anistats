import { Component, OnInit, Input } from '@angular/core';
import { Filter } from 'src/app/interfaces/filters';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  animations: [
    trigger(
      'checkAnimation', [
        transition(':enter', [
          style({ opacity: 0 }),
          animate('100ms ease-in', style({ opacity: 1}))
        ]),
        transition(':leave', [
          animate('100ms ease-out', style({ opacity: 0 }))
        ])
      ]
    )
  ]
})
export class FilterComponent implements OnInit {
  @Input() filter: Filter;
  currentYear: number;

  constructor() { }

  ngOnInit(): void {
    this.currentYear = new Date().getFullYear();
  }

  selectAll() {
    if(this.filter.checked.length == this.filter.values.length) { // already selected all
      this.filter.checked = [];
    } else {
      this.filter.checked = this.filter.values.map(x => x.key);
    }
  }

  check(key: string) {
    if(Array.isArray(this.filter.checked)) {
      let i = this.filter.checked.indexOf(key);
      if (i > -1) { // exists, remove from array
        this.filter.checked.splice(i, 1);
      } else { // add
        this.filter.checked.push(key);
      }
    }
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { Filter } from 'src/app/interfaces/filters';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() filter: Filter;

  constructor() { }

  ngOnInit(): void {
    
  }

  check(key: string) {
    let i = this.filter.checked.indexOf(key);
    if (i > -1) { // exists, remove from array
      this.filter.checked.splice(i, 1);
    } else { // add
      this.filter.checked.push(key);
    }
  }

}

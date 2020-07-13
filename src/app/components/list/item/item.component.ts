import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Media } from 'src/app/services/series.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {
  @Input() anime;
  @Output() switch: EventEmitter<Media> = new EventEmitter();
  
  constructor() { }

  ngOnInit(): void {
  }
}

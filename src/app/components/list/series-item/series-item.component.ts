import { Component, OnInit, Input } from '@angular/core';
import { Media } from 'src/app/services/series.service';
import { LocaleService } from 'src/app/services/locale.service';

@Component({
  selector: 'app-series-item',
  templateUrl: './series-item.component.html',
  styleUrls: ['./series-item.component.scss']
})
export class SeriesItemComponent implements OnInit {
  @Input() data: Media;
  formattedDate: string;

  constructor(public locale: LocaleService) { }

  ngOnInit(): void {
    if(this.data.added.time == 0) this.formattedDate = 'Unknown';
    else this.formattedDate = this.locale.formatActivityDate(this.data.added);
  }

  resolveColor(status: string) {
    switch(status) {
      case 'CURRENT':
        return '#2f754e'
      case 'DROPPED':
        return '#a44646'
      case 'PAUSED':
        return '#ad8015'
      case 'COMPLETED':
        return '#14699b'
      default:
        return '#595f6e'
    }
  }

  resolveIcon(status: string) {
    switch(status) {
      case 'CURRENT':
        return 'play_arrow'
      case 'DROPPED':
        return 'stop'
      case 'PAUSED':
        return 'pause'
      case 'COMPLETED':
        return 'done'
      default:
        return 'schedule'
    }
  }

}

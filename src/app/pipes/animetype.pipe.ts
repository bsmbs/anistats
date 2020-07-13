import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'animetype'
})
export class AnimetypePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    if(value == 'TV_SHORT') return 'TV Short';
    if(value == 'MOVIE' || value == 'SPECIAL') return value.charAt(0) + value.slice(1).toLowerCase();

    return value;
  }

}

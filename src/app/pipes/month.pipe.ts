import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'month'
})
export class MonthPipe implements PipeTransform {

  transform(value, ...args: unknown[]): string {
    if (value >= 10) return value;
    else return '0' + value;
  }

}

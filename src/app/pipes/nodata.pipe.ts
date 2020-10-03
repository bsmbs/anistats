import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nodata'
})
export class NodataPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): string {
    if(typeof value == 'undefined' || value === null) return '?'
    else return value;
  }

}

import type { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';

@Pipe({
  name: 'customPipe',
})
export class CustomPipePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return `CustomPipe: ${value}`;
  }
}

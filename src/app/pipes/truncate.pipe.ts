import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to truncate text with ellipsis
 * Usage: {{ text | truncate:20 }} or {{ text | truncate:20:'...' }}
 */
@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 50, suffix: string = '...'): string {
    if (!value) return '';

    if (value.length <= limit) {
      return value;
    }

    return value.substring(0, limit - suffix.length) + suffix;
  }
}

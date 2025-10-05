import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to format file sizes in human readable format
 * Usage: {{ size | fileSize }} or {{ size | fileSize:'MB' }}
 */
@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {
  transform(bytes: number, unit?: 'B' | 'KB' | 'MB' | 'GB' | 'TB'): string {
    if (bytes === 0) return '0 B';
    if (!bytes || bytes < 0) return '';

    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const k = 1024;

    if (unit) {
      const unitIndex = units.indexOf(unit);
      if (unitIndex === -1) return '';

      const size = bytes / Math.pow(k, unitIndex);
      return `${this.roundToDecimal(size, 2)} ${unit}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const size = bytes / Math.pow(k, i);

    return `${this.roundToDecimal(size, 2)} ${units[i]}`;
  }

  private roundToDecimal(num: number, decimal: number): number {
    return Math.round(num * Math.pow(10, decimal)) / Math.pow(10, decimal);
  }
}

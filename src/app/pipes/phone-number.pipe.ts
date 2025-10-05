import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe to format phone numbers
 * Usage: {{ phone | phoneNumber }} or {{ phone | phoneNumber:'(###) ###-####' }}
 */
@Pipe({
  name: 'phoneNumber',
  standalone: true
})
export class PhoneNumberPipe implements PipeTransform {
  transform(value: string, format?: string): string {
    if (!value) return '';

    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');

    if (format) {
      return this.applyCustomFormat(cleaned, format);
    }

    // Default formatting based on length
    switch (cleaned.length) {
      case 7:
        return cleaned.replace(/(\d{3})(\d{4})/, '$1-$2');
      case 10:
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      case 11:
        return cleaned.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, '+$1 ($2) $3-$4');
      default:
        return value;
    }
  }

  private applyCustomFormat(cleaned: string, format: string): string {
    let result = format;
    let digitIndex = 0;

    for (let i = 0; i < result.length && digitIndex < cleaned.length; i++) {
      if (result[i] === '#') {
        result = result.substring(0, i) + cleaned[digitIndex] + result.substring(i + 1);
        digitIndex++;
      }
    }

    return result;
  }
}

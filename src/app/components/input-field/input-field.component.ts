import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ViewChild, ElementRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputFieldComponent {
  // label removed; this component is a simple text input without hint/error
  @Input() placeholder?: string;
  /** 'text' or 'file' */
  @Input() type: 'text' | 'file' = 'text';
  // This component is a text input
  @Input() disabled = false;
  @Input() hostClass = '';
  @Input() inputClass = '';
  @Input() id = '';
  // no rows for input

  @Output() valueChange = new EventEmitter<string | FileList | File | null>();

  @ViewChild('input', { static: false }) input!: ElementRef<HTMLTextAreaElement | HTMLInputElement>;

  // local value for binding (string for text, FileList for file)
  private _value = signal<string | FileList | null>(null);

  onInput(e: Event) {
    const target = e.target as HTMLTextAreaElement | HTMLInputElement;
    const v = target.value;
    this._value.set(v);
    this.valueChange.emit(v);

    // Auto-resize pour textarea
    if (target.tagName === 'TEXTAREA') {
      this.autoResize(target as HTMLTextAreaElement);
    }
  }

  private autoResize(textarea: HTMLTextAreaElement) {
    // Reset height to auto to get the actual scrollHeight
    textarea.style.height = 'auto';

    // Calculate new height (min 1 row, max 200px)
    const minHeight = parseInt(getComputedStyle(textarea).lineHeight) || 20;
    const maxHeight = 200;
    const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);

    // Set the new height
    textarea.style.height = newHeight + 'px';

    // Add or remove overflow based on max height
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.overflowY = 'hidden';
    }
  }

  onFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    this._value.set(files || null);
    // emit FileList or null
    this.valueChange.emit(files && files.length === 1 ? files[0] : (files || null));
  }

  /** clear file input programmatically */
  clearFile() {
    if (this.input && this.input.nativeElement) {
      this.input.nativeElement.value = '';
      this._value.set(null);
      this.valueChange.emit(null);

      // Reset textarea height if it's a textarea
      if (this.input.nativeElement.tagName === 'TEXTAREA') {
        const textarea = this.input.nativeElement as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.overflowY = 'hidden';
      }
    }
  }

  /** Clear the input (text or file) and emit null */
  clear() {
    if (this.input && this.input.nativeElement) {
      this.input.nativeElement.value = '';
      this._value.set(null);
      this.valueChange.emit(null);
    }
  }

  openFilePicker() {
    if (this.disabled) return;
    const el = this.input && this.input.nativeElement as HTMLInputElement | undefined;
    if (el) el.click();
  }

  onVisibleKeydown(e: KeyboardEvent) {
    if (this.disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.openFilePicker();
    }
  }
}

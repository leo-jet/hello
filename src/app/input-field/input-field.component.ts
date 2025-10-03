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

  @ViewChild('input', { static: false }) input!: ElementRef<HTMLInputElement>;

  // local value for binding (string for text, FileList for file)
  private _value = signal<string | FileList | null>(null);

  onInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this._value.set(v);
    this.valueChange.emit(v);
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

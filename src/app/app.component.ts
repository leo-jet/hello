import { Component, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SelectComponent } from './select/select.component';
import { MenuComponent } from './menu/menu.component';
import { InputFieldComponent } from './input-field/input-field.component';
import { IconButtonComponent } from './icon-button/icon-button.component';
import { ListComponent } from './list/list.component';
import { ListItemComponent } from './list-item/list-item.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    SelectComponent,
    MenuComponent,
    InputFieldComponent,
    IconButtonComponent,
    ListComponent,
    ListItemComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'template-widget';
  // example options passed to the dropdown component
  dropdownOptions = [
    { value: 'openai', label: 'OpenAI', img_path: 'openai.png' },
    { value: 'google', label: 'Google', img_path: 'gemini.png' },
  ];

  // (example dropdown state removed — not used)

  // Chat-specific state for the requested control (signals)
  currentModel: WritableSignal<any> = signal<any>({ value: 'openai', label: 'OpenAI', img_path: 'openai.png' });
  selectedFiles: WritableSignal<File[]> = signal<File[]>([]);
  draftMessage: WritableSignal<string> = signal<string>('');

  onModelChange(v: any) {
    this.currentModel.set(v);
    console.log('Model changed to', this.currentModel());
  }

  onFilesAdded(f: string | File | FileList | null) {
    if (!f) return;
    if (typeof f === 'string') return; // ignore accidental strings
    if (f instanceof File) this.selectedFiles.set([f]);
    else this.selectedFiles.set(Array.from(f));
    console.log('Files added', this.selectedFiles().map((x) => x.name));
  }

  onDraftChange(v: string | File | FileList | null) {
    if (typeof v === 'string') this.draftMessage.set(v);
    else this.draftMessage.set('');
  }

  sendMessage() {
    if (!this.draftMessage().trim()) return;
    console.log('SEND:', this.draftMessage());
    // clear draft and files
    this.draftMessage.set('');
    this.selectedFiles.set([]);
  }

  // Helpers for template consumption (templates see plain values, not Signal types)
  get draftMessageValue(): string {
    return this.draftMessage();
  }

  get selectedFilesValue(): File[] {
    return this.selectedFiles();
  }

  get currentModelValue(): any {
    return this.currentModel();
  }
}

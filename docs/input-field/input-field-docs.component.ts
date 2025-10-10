import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputFieldComponent } from '../../src/app/components/input-field/input-field.component';

@Component({
  selector: 'app-input-field-docs',
  standalone: true,
  imports: [CommonModule, InputFieldComponent],
  templateUrl: './input-field-docs.component.html'
})
export class InputFieldDocsComponent {
  // Active tab
  activeTab = signal<'use-cases' | 'api' | 'behavior'>('use-cases');

  // Signals to hold demo values
  textValue = signal<string>('');
  textareaValue = signal<string>('');
  fileValue = signal<File | FileList | null>(null);
  searchValue = signal<string>('');
  emailValue = signal<string>('');

  // Set active tab
  setActiveTab(tab: 'use-cases' | 'api' | 'behavior') {
    this.activeTab.set(tab);
  }

  // Handlers called by demos
  onTextChange(v: string | FileList | File | null) {
    this.textValue.set((v as string) || '');
  }

  onTextareaChange(v: string | FileList | File | null) {
    this.textareaValue.set((v as string) || '');
  }

  onFileChange(v: string | FileList | File | null) {
    this.fileValue.set(v as any);
  }

  onSearchChange(v: string | FileList | File | null) {
    this.searchValue.set((v as string) || '');
  }

  onEmailChange(v: string | FileList | File | null) {
    this.emailValue.set((v as string) || '');
  }

  formatFile(v: File | FileList | null) {
    if (!v) return 'Aucun fichier sélectionné';
    if ((v as File).name) return (v as File).name;
    const list = v as FileList;
    if (list.length === 0) return 'Aucun fichier sélectionné';
    return Array.from(list).map(f => f.name).join(', ');
  }
}


import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '../../src/app/components/select/select.component';

@Component({
  standalone: true,
  imports: [CommonModule, SelectComponent],
  templateUrl: './select-docs.component.html'
})
export class SelectDocsComponent {
  // Tab management
  activeTab = signal<'use-cases' | 'api' | 'behavior'>('use-cases');

  // Example 1: primitive options
  colors = ['red', 'green', 'blue'];
  selectedColor = signal<string | null>(null);

  // Example 2: objects with icons
  iconOptions = [
    { value: 'home', label: 'Home', icon: '🏠' },
    { value: 'user', label: 'User', icon: '👤' }
  ];
  selectedIconOption = signal<any | null>(null);

  // Example 3: return object
  opts = [
    { id: 1, name: 'Option A', meta: 'A' },
    { id: 2, name: 'Option B', meta: 'B' }
  ];
  selectedObject = signal<any | null>(null);

  // Example 4: image avatars
  users = [
    { id: 'u1', name: 'Alice', avatar: '/assets/avatars/alice.jpg' },
    { id: 'u2', name: 'Bob', avatar: '/assets/avatars/bob.jpg' }
  ];
  selectedUser = signal<any | null>(null);

  // Example 5: default value
  selectedDefaultColor = signal<string | null>('blue');

  onSelectColor(val: unknown) {
    this.selectedColor.set(val as string);
  }

  onSelectIcon(opt: unknown) {
    this.selectedIconOption.set(opt);
  }

  onSelectObject(ev: unknown) {
    this.selectedObject.set(ev as any);
  }

  onSelectUser(ev: unknown) {
    this.selectedUser.set(ev as any);
  }

  onSelectDefaultColor(val: unknown) {
    this.selectedDefaultColor.set(val as string);
  }

  setActiveTab(tab: 'use-cases' | 'api' | 'behavior') {
    this.activeTab.set(tab);
  }
}

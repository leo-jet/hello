import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from '../../src/app/components/dropdown/dropdown.component';

interface Example {
  title: string;
  description: string;
  component: any;
  props?: any;
}

@Component({
  selector: 'app-dropdown-docs',
  standalone: true,
  imports: [CommonModule, DropdownComponent],
  templateUrl: './dropdown-docs.component.html'
})
export class DropdownDocsComponent {

  // Basic demo data
  basicOptions = [
    { value: 'create', label: 'Create' },
    { value: 'edit', label: 'Edit' },
    { value: 'delete', label: 'Delete' },
    { value: 'archive', label: 'Archive' }
  ];

  // With icons
  iconOptions = [
    { value: 'save', label: 'Save', icon: '💾' },
    { value: 'print', label: 'Print', icon: '🖨️' },
    { value: 'share', label: 'Share', icon: '📤' },
    { value: 'download', label: 'Download', icon: '⬇️' }
  ];

  // Font Awesome icons
  faIconOptions = [
    { value: 'home', label: 'Home', icon: 'fa fa-home' },
    { value: 'user', label: 'Profile', icon: 'fa fa-user' },
    { value: 'settings', label: 'Settings', icon: 'fa fa-cog' },
    { value: 'help', label: 'Help', icon: 'fa fa-question-circle' }
  ];

  // Language selector with flags
  languageOptions = [
    { value: 'en', label: 'English', img_path: 'https://flagcdn.com/16x12/us.png' },
    { value: 'fr', label: 'Français', img_path: 'https://flagcdn.com/16x12/fr.png' },
    { value: 'es', label: 'Español', img_path: 'https://flagcdn.com/16x12/es.png' },
    { value: 'de', label: 'Deutsch', img_path: 'https://flagcdn.com/16x12/de.png' },
    { value: 'it', label: 'Italiano', img_path: 'https://flagcdn.com/16x12/it.png' }
  ];

  // User selector with avatars
  userOptions = [
    {
      value: 1,
      label: 'John Doe',
      img_path: 'https://i.pravatar.cc/32?img=1'
    },
    {
      value: 2,
      label: 'Jane Smith',
      img_path: 'https://i.pravatar.cc/32?img=2'
    },
    {
      value: 3,
      label: 'Mike Johnson',
      img_path: 'https://i.pravatar.cc/32?img=3'
    }
  ];

  // Custom styled options
  colorOptions = [
    { value: 'primary', label: 'Primary Color' },
    { value: 'secondary', label: 'Secondary Color' },
    { value: 'accent', label: 'Accent Color' },
    { value: 'success', label: 'Success Color' },
    { value: 'warning', label: 'Warning Color' },
    { value: 'error', label: 'Error Color' }
  ];

  // Complex data options
  productOptions = [
    {
      value: 'premium',
      label: 'Premium Plan - $29/mo',
      icon: '⭐'
    },
    {
      value: 'standard',
      label: 'Standard Plan - $19/mo',
      icon: '📦'
    },
    {
      value: 'basic',
      label: 'Basic Plan - $9/mo',
      icon: '📋'
    }
  ];

  // Large list for performance testing
  largeOptions = Array.from({ length: 50 }, (_, i) => ({
    value: `item-${i + 1}`,
    label: `Item ${i + 1}`,
    icon: i % 3 === 0 ? '📄' : i % 3 === 1 ? '📁' : '🔧'
  }));

  // State management for selections
  selectedBasic = signal<unknown>(null);
  selectedIcon = signal<unknown>(null);
  selectedFaIcon = signal<unknown>(null);
  selectedLanguage = signal<unknown>(null);
  selectedUser = signal<unknown>(null);
  selectedColor = signal<unknown>(null);
  selectedProduct = signal<unknown>(null);
  selectedLarge = signal<unknown>(null);
  selectedObject = signal<any>(null);

  // Event handlers
  onBasicSelection(value: unknown) {
    this.selectedBasic.set(value);
  }

  onIconSelection(value: unknown) {
    this.selectedIcon.set(value);
  }

  onFaIconSelection(value: unknown) {
    this.selectedFaIcon.set(value);
  }

  onLanguageSelection(value: unknown) {
    this.selectedLanguage.set(value);
  }

  onUserSelection(value: unknown) {
    this.selectedUser.set(value);
  }

  onColorSelection(value: unknown) {
    this.selectedColor.set(value);
  }

  onProductSelection(value: unknown) {
    this.selectedProduct.set(value);
  }

  onLargeSelection(value: unknown) {
    this.selectedLarge.set(value);
  }

  onObjectSelection(obj: any) {
    this.selectedObject.set(obj);
  }

  // Smooth scroll to a section by id
  scrollTo(id: string) {
    try {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } catch (e) {
      // fallback: set location hash
      location.hash = id;
    }
  }
}

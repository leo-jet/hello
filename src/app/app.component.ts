import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DropdownComponent } from './dropdown/dropdown.component';
import { SelectComponent } from './select/select.component';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DropdownComponent, SelectComponent, JsonPipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'template-widget';
  // example options passed to the dropdown component
  dropdownOptions = [
    { value: 'openai', label: 'OpenAI', img_path: 'openai.png' },
    { value: 'banana', label: 'Banana', icon: '🍌' },
    { value: 'google', label: 'Google', img_path: 'gemini.png' },
  ];

  selectedFromDropdown: unknown | null = null;
  selectedObjectFromDropdown: unknown | null = null;

  onDropdownSelect(value: unknown) {
    this.selectedFromDropdown = value;
    console.log('Dropdown selection:', value);
  }

  onDropdownSelectObject(obj: unknown) {
    this.selectedObjectFromDropdown = obj;
    console.log('Dropdown selection object:', obj);
  }
}


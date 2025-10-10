import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectComponent } from '../../../components/select/select.component';
import { InputFieldComponent } from '../../../components/input-field/input-field.component';
import { IconButtonComponent } from '../../../components/icon-button/icon-button.component';

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
}

export interface AIModel {
  id: string;
  display_name: string;
  description: string;
  has_reasoning: boolean;
  reasoning_level: ('low' | 'medium' | 'high')[];
}

export interface ChatModeInfo {
  mode: string | null;
  label: string;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-main-chat-input',
  imports: [CommonModule, SelectComponent, InputFieldComponent, IconButtonComponent],
  templateUrl: './main-chat-input.component.html',
  styleUrl: './main-chat-input.component.css'
})
export class MainChatInputComponent {
  currentChatModeInfo = input<ChatModeInfo | null>(null);
  modelSelectOptions = input<SelectOption[]>([]);
  reasoningLevelSelectOptions = input<SelectOption[]>([]);
  selectedModelId = input<string>('');
  selectedReasoningLevel = input<string>('medium');
  hasReasoning = input<boolean>(false);
  isSendButtonDisabled = input<boolean>(true);

  modelSelect = output<string>();
  reasoningLevelSelect = output<string>();
  inputChange = output<string>();
  attachClick = output<void>();
  microphoneClick = output<void>();
  sendMessage = output<void>();

  onModelSelect(event: any) {
    this.modelSelect.emit(event.value);
  }

  onReasoningLevelSelect(event: any) {
    this.reasoningLevelSelect.emit(event.value);
  }

  onInputChange(value: string | FileList | File | null) {
    if (typeof value === 'string') {
      this.inputChange.emit(value);
    }
  }

  onAttachClick() {
    this.attachClick.emit();
  }

  onMicrophoneClick() {
    this.microphoneClick.emit();
  }

  onSendMessage() {
    this.sendMessage.emit();
  }
}

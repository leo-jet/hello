import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../../../../components/dialog/dialog.component';

@Component({
  selector: 'app-help-dialog',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './help-dialog.component.html',
  styleUrl: './help-dialog.component.css'
})
export class HelpDialogComponent {
  visible = model<boolean>(false);

  onClose(): void {
    this.visible.set(false);
  }
}

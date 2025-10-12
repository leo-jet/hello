import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../../../../components/dialog/dialog.component';

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './settings-dialog.component.html',
  styleUrl: './settings-dialog.component.css'
})
export class SettingsDialogComponent {
  visible = model<boolean>(false);

  onCancel(): void {
    this.visible.set(false);
  }

  onSave(): void {
    // TODO: Implémenter la sauvegarde des paramètres
    console.log('Paramètres sauvegardés');
    this.visible.set(false);
  }
}

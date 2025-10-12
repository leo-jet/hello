import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../../../../components/dialog/dialog.component';

@Component({
  selector: 'app-profile-dialog',
  standalone: true,
  imports: [CommonModule, DialogComponent],
  templateUrl: './profile-dialog.component.html',
  styleUrl: './profile-dialog.component.css'
})
export class ProfileDialogComponent {
  visible = model<boolean>(false);

  onCancel(): void {
    this.visible.set(false);
  }

  onUpdate(): void {
    // TODO: Implémenter la mise à jour du profil
    console.log('Profil mis à jour');
    this.visible.set(false);
  }
}

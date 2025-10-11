import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from '../../src/app/components/dialog';

@Component({
  standalone: true,
  selector: 'app-dialog-docs',
  imports: [CommonModule, DialogComponent],
  templateUrl: './dialog-docs.component.html'
})
export class DialogDocsComponent {
  // Tab management
  activeTab = signal<'overview' | 'api' | 'examples'>('overview');

  // Dialog visibility signals
  simpleDialogVisible = signal(false);
  headerFooterDialogVisible = signal(false);
  scrollableDialogVisible = signal(false);

  scaleDialogVisible = signal(false);
  fadeDialogVisible = signal(false);
  slideUpDialogVisible = signal(false);
  slideDownDialogVisible = signal(false);

  topDialogVisible = signal(false);
  bottomDialogVisible = signal(false);
  leftDialogVisible = signal(false);
  rightDialogVisible = signal(false);

  persistentDialogVisible = signal(false);
  seamlessDialogVisible = signal(false);
  maximizedDialogVisible = signal(false);
  fullWidthDialogVisible = signal(false);

  setActiveTab(tab: 'overview' | 'api' | 'examples') {
    this.activeTab.set(tab);
  }

  // Helper methods
  openDialog(dialogSignal: any) {
    dialogSignal.set(true);
  }

  closeDialog(dialogSignal: any) {
    dialogSignal.set(false);
  }
}

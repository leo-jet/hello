import {
  Component,
  input,
  output,
  model,
  signal,
  computed,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogPosition, DialogTransition } from './dialog.models';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css'
})
export class DialogComponent {
  // Two-way binding pour la visibilité
  visible = model<boolean>(false);

  // Configuration Inputs
  position = input<DialogPosition>('standard');
  transitionShow = input<DialogTransition>('scale');
  persistent = input<boolean>(false);
  seamless = input<boolean>(false);
  maximized = input<boolean>(false);
  fullWidth = input<boolean>(false);
  fullHeight = input<boolean>(false);
  cardClass = input<string>('');
  cardStyle = input<any>({});
  backdropStyle = input<any>({});
  style = input<any>({});

  // Outputs
  show = output<void>();
  hide = output<void>();

  // Signal interne pour l'animation
  isAnimating = signal<boolean>(false);

  // Computed properties pour les classes CSS
  dialogClasses = computed(() => {
    const classes = [
      'fixed inset-0 z-50 flex items-center justify-center'
    ];

    // Position
    const pos = this.position();
    if (pos === 'top') {
      classes.push('items-start');
    } else if (pos === 'bottom') {
      classes.push('items-end');
    } else if (pos === 'left') {
      classes.push('justify-start');
    } else if (pos === 'right') {
      classes.push('justify-end');
    }

    return classes.join(' ');
  });

  backdropClasses = computed(() => {
    const classes = ['absolute inset-0'];

    if (this.seamless()) {
      classes.push('bg-transparent');
    } else {
      classes.push('bg-black/50 backdrop-blur-sm');
    }

    return classes.join(' ');
  });

  cardClasses = computed(() => {
    const classes = [
      'relative z-10',
      'bg-white dark:bg-gray-800',
      'rounded-lg shadow-xl',
      'flex flex-col',
      'overflow-hidden'
    ];

    // Maximized
    if (this.maximized()) {
      classes.push('w-full h-full rounded-none');
      return classes.join(' ');
    }

    // Full width/height
    if (this.fullWidth()) {
      classes.push('w-full');
    }
    if (this.fullHeight()) {
      classes.push('h-full');
    } else {
      // Hauteur maximale de 90vh pour toujours tenir dans l'écran
      classes.push('max-h-[90vh]');
    }

    // Custom classes
    const customClass = this.cardClass();
    if (customClass) {
      classes.push(customClass);
    } else if (!this.fullWidth() && !this.fullHeight()) {
      // Default size if no custom class
      classes.push('max-w-md');
    }

    return classes.join(' ');
  });

  transitionClass = computed(() => {
    const transition = this.transitionShow();
    const animationMap: Record<DialogTransition, string> = {
      'scale': 'animate-[dialog-scale-in_0.3s_ease-out]',
      'fade': 'animate-[dialog-fade-in_0.3s_ease-out]',
      'slide-up': 'animate-[dialog-slide-up_0.3s_ease-out]',
      'slide-down': 'animate-[dialog-slide-down_0.3s_ease-out]',
      'slide-left': 'animate-[dialog-slide-left_0.3s_ease-out]',
      'slide-right': 'animate-[dialog-slide-right_0.3s_ease-out]'
    };
    return animationMap[transition] || animationMap['scale'];
  });

  constructor() {
    // Effect pour émettre les events
    effect(() => {
      if (this.visible()) {
        this.show.emit();
      }
    });
  }

  // Méthodes
  onBackdropClick(event: MouseEvent) {
    if (this.persistent()) {
      // Animation shake si persistent
      this.shake();
      return;
    }

    // Fermer le dialog
    this.visible.set(false);
    this.hide.emit();
  }

  closeDialog() {
    if (this.persistent()) {
      this.shake();
      return;
    }

    this.visible.set(false);
    this.hide.emit();
  }

  shake() {
    // Animation shake (à implémenter dans le CSS si nécessaire)
  }

  // Keyboard events
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && !this.persistent()) {
      this.closeDialog();
    }
  }
}

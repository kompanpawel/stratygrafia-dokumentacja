import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modal',
  imports: [
    FormsModule
  ],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  id = input.required<string>();
  name = input<string | undefined>();
  initialValue = input.required<number>();
  isOpen = input<boolean>(false);

  onSave = output<{id: string, newValue: number}>();
  onCancel = output<void>();

  localValue = signal<number>(0)

  private dialogElement = viewChild<ElementRef<HTMLDialogElement>>('nativeDialog')

  constructor() {
    effect(() => {
      this.localValue.set(this.initialValue())
    });

    effect(() => {
      const dialog = this.dialogElement()?.nativeElement;
      if (dialog) {
        if (this.isOpen()) {
          if (!dialog.open) dialog.showModal();
        } else {
          if (dialog.open) dialog.close();
        }
      }
    });
  }

  saveModal() {
    this.onSave.emit({id: this.id(), newValue: this.localValue()})
  }

  closeModal() {
    this.onCancel.emit();
  }

  onClose() {
    this.onCancel.emit();
  }
}

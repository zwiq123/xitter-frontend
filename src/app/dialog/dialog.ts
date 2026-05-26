import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  imports: [],
  templateUrl: './dialog.html',
  styleUrl: './dialog.css',
})
export class Dialog {

  dialogTitle = input.required<string>();
  dialogHint = input<string>("");

  dialogOpen = input.required<boolean>();

  closeDialog = output<void>();
  continueClick = output<void>();

  isReady = input.required<boolean>();

  errorMessage = input.required<string>();

  close() {
    this.closeDialog.emit();
  }

  continue() {
    this.continueClick.emit();
  }
}

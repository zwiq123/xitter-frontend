import { Component, signal, computed } from '@angular/core';
import { Dialog } from '../dialog/dialog';

@Component({
  selector: 'app-reset-password-page',
  imports: [Dialog],
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.css',
})
export class ResetPasswordPage {

  dialogOpen = signal(true);

  closeDialog() {
    this.dialogOpen.set(false);
    this.closeResetReadyDialog();
  }

  resetReadyDialogOpen = signal(true);

  resetReadyPassword = signal("");
  resetReadyRepeatPassword = signal("");

  closeResetReadyDialog() {
    this.resetReadyDialogOpen.set(false);
    this.resetReadyPassword.set("");
    this.resetReadyRepeatPassword.set("");
  }

  updateResetReadyPassword($event: any){
    if (!$event.target) return;
    this.resetReadyPassword.set($event.target.value);
  }

  updateResetReadyRepeatPassword($event: any){
    if (!$event.target) return;
    this.resetReadyRepeatPassword.set($event.target.value);
  }

  errorMessage = computed(() => {
    return "";
  })

  isResetReady = computed(() => {
    return true;
  })
}

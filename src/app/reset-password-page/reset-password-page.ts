import { Component, signal, computed, inject, linkedSignal } from '@angular/core';
import { Dialog } from '../dialog/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password-page',
  imports: [Dialog],
  templateUrl: './reset-password-page.html',
  styleUrl: './reset-password-page.css',
})
export class ResetPasswordPage {

  private toastr = inject(ToastrService);

  private route = inject(ActivatedRoute);
  hash = signal<string | null>("");

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      this.hash.set(params.get('hash'));
    });
  }

  dialogOpen = signal(true);

  closeDialog() {
    this.dialogOpen.set(false);
    this.closeResetReadyDialog();
  }

  resetReadyDialogOpen = signal(true);

  password = signal("");
  repeatPassword = signal("");

  closeResetReadyDialog() {
    this.resetReadyDialogOpen.set(false);
    this.password.set("");
    this.repeatPassword.set("");
  }

  updatePassword($event: any){
    if (!$event.target) return;
    this.password.set($event.target.value);
  }

  updateRepeatPassword($event: any){
    if (!$event.target) return;
    this.repeatPassword.set($event.target.value);
  }

  errorMessage = linkedSignal<"Coś poszło nietak" | "Nieprawidłowy hash" | "Hasło musi mieć przynajmniej 8 znaków." | "Hasła się nie zgadzają." | `Hasło musi zawierać małą literę, wielką literę, cyfrę i znak specjalny (!@#$%)^(&*-_=+<>.,|;:).` |"">(() => {
    if (this.password().length != 0 && this.password().length < 8) return "Hasło musi mieć przynajmniej 8 znaków."
    
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
    const numbers = "0123456789";
    const specialChars = "!@#$%)^(&*-_=+<>.,|;:";
    const includeMessage = `Hasło musi zawierać małą literę, wielką literę, cyfrę i znak specjalny (${specialChars}).`;

    if (this.password() === '') return "";

    let includesAny = false;
    for (const char of this.password()) {
      if (lowercaseLetters.includes(char)) {
        includesAny = true;
        break;
      }
    }
    if (!includesAny) return includeMessage;

    includesAny = false;
    for (const char of this.password()) {
      if (uppercaseLetters.includes(char)) {
        includesAny = true;
        break;
      }
    }
    if (!includesAny) return includeMessage;

    includesAny = false;
    for (const char of this.password()) {
      if (numbers.includes(char)) {
        includesAny = true;
        break;
      }
    }
    if (!includesAny) return includeMessage;

    includesAny = false;
    for (const char of this.password()) {
      if (specialChars.includes(char)) {
        includesAny = true;
        break;
      }
    }
    if (!includesAny) return includeMessage;

    if (this.password() !== this.repeatPassword()) return "Hasła się nie zgadzają.";
    return "";
  })

  isResetReady = computed(() => {
    return this.errorMessage() === "" && !this.finished();
  })

  loading = signal(false);

  finished = signal(false);

  resetPassword() {
    this.loading.set(true);
    if (this.hash() == null) {
      this.errorMessage.set("Nieprawidłowy hash");
      return;
    }
    const resetBody = {
      hash: this.hash(),
      newPassword: this.password() 
    }

    fetch("/api/auth/resetPassword", {
      method: "POST",
      body: JSON.stringify(resetBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      if (!res.ok) {
        this.errorMessage.set("Coś poszło nietak")
      } else {
        this.toastr.success("Hasło zostało zmienione", "Udało się");
        this.loading.set(false);
        this.finished.set(true);
      }
    })
  }
}

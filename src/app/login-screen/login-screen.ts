import { Component, signal, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login-screen',
  imports: [RouterLink],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.css',
})
export class LoginScreen {

  // general dialog

  dialogOpen = signal(false);

  closeDialog() {
    this.dialogOpen.set(false);
    this.loginDialogOpen.set(false);
    this.registerDialog1Open.set(false);
    this.registerDialog2Open.set(false);

    this.loginPassword.set("");
    this.loginUsername.set("");
    this.registerPassword.set("");
    this.registerRepeatPassword.set("");
    this.registerUsername.set("");
    this.registerEmail.set("");
    this.registerImageFilename.set("");
    this.registerImageUrl.set("");
  }

  // loginDialog

  loginDialogOpen = signal(false);

  openLoginDialog() {
    this.dialogOpen.set(true);
    this.registerDialog1Open.set(false)
    this.registerDialog2Open.set(false)
    this.loginDialogOpen.set(true);
  }

  closeLoginDialog() {
    this.loginDialogOpen.set(false);
    this.loginPassword.set("");
    this.loginUsername.set("");
  }

  loginUsername = signal("");
  loginPassword = signal("");

  updateLoginUsername($event: any){
    if (!$event.target) return;
    this.loginUsername.set($event.target.value);
  }

  updateLoginPassword($event: any){
    if (!$event.target) return;
    this.loginPassword.set($event.target.value);
  }

  loginErrorMessage = computed(() => {
    return "";
  });

  // registerDialog

  registerDialog1Open = signal(false);
  registerDialog2Open = signal(false);

  openRegister1Dialog() {
    this.dialogOpen.set(true);
    this.loginDialogOpen.set(false)
    this.registerDialog1Open.set(true);
    this.registerDialog2Open.set(false);
  }

  closeRegisterDialog() {
    this.registerDialog1Open.set(false);
    this.registerDialog2Open.set(false);
    this.registerPassword.set("");
    this.registerRepeatPassword.set("");
    this.registerUsername.set("");
    this.registerEmail.set("");
    this.registerImageFilename.set("");
    this.registerImageUrl.set("");
  }

  openRegister2Dialog() {
    this.dialogOpen.set(true);
    this.loginDialogOpen.set(false);
    this.registerDialog1Open.set(false);
    this.registerDialog2Open.set(true);
  }

  closeRegister2Dialog() {
    this.registerDialog2Open.set(false);
    this.registerDialog1Open.set(true);
    this.registerUsername.set("");
    this.registerImageFilename.set("");
    this.registerImageUrl.set("");
  }

  registerEmail = signal("");
  registerPassword = signal("");
  registerRepeatPassword = signal("");
  registerUsername = signal("");
  registerImageUrl = signal("");
  registerImageFilename = signal("");

  isEmailAnEmail = () => {
    return this.registerEmail()
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  isRegisterStepOneReady = computed(() => {
    return  this.isEmailAnEmail() &&
            this.registerPassword().trim() != "" && 
            this.registerRepeatPassword().trim() != "" &&
            this.registerStepOneErrorMessage() == "";
  })

  updateRegisterEmail($event: any){
    if (!$event.target) return;
    this.registerEmail.set($event.target.value);
  }

  updateRegisterPassword($event: any){
    if (!$event.target) return;
    this.registerPassword.set($event.target.value);
  }

  updateRegisterRepeatPasword($event: any) {
    if (!$event.target) return;
    this.registerRepeatPassword.set($event.target.value);
  }

  updateRegisterUsername($event: any){
    if (!$event.target) return;
    this.registerUsername.set($event.target.value);
  }

  updateRegisterImageUrl($event: any){
    if (!$event.target) return;
    const target = $event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      this.registerImageFilename.set(file.name);

      fetch("/api/post")
      .then(res => res.json())
      .then(data => console.log(data));

      const url = URL.createObjectURL(file);
      this.registerImageUrl.set(url);
    }
  }

  registerStepOneErrorMessage = computed(() => {
    if (this.registerEmail().length != 0 && !this.isEmailAnEmail()) return "Nieprawidłowy format emaila."

    if (this.registerPassword().length != 0 && this.registerPassword().length < 8) return "Hasło musi mieć przynajmniej 8 znaków."
    
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVXYZ";
    const numbers = "0123456789";
    const specialChars = "!@#$%)^(&*-_=+<>.,|;:";
    const includeMessage = `Hasło musi zawierać małą literę, wielką literę, cyfrę i znak specjalny (${specialChars}).`;

    if (this.registerPassword() === '') return "";

    let includesAny = false;
    for (const char of this.registerPassword()) {
      if (lowercaseLetters.includes(char)) {
        includesAny = true;
        break;
      }
    }
    if (!includesAny) return includeMessage;

    includesAny = false;
    for (const char of this.registerPassword()) {
      if (uppercaseLetters.includes(char)) {
        includesAny = true;
        break;
      }
    }
    if (!includesAny) return includeMessage;

    includesAny = false;
    for (const char of this.registerPassword()) {
      if (numbers.includes(char)) {
        includesAny = true;
        break;
      }
    }
    if (!includesAny) return includeMessage;

    includesAny = false;
    for (const char of this.registerPassword()) {
      if (specialChars.includes(char)) {
        includesAny = true;
        break;
      }
    }
    if (!includesAny) return includeMessage;

    if (this.registerPassword() !== this.registerRepeatPassword()) return "Hasła się nie zgadzają.";

    return "";
  });

  registerStepTwoErrorMessage = computed(() => {
    return "";
  })

}

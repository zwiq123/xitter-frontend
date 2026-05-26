import { Component, signal, computed, output, model, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dialog } from '../dialog/dialog';

@Component({
  selector: 'app-login-screen',
  imports: [Dialog],
  templateUrl: './login-screen.html',
  styleUrl: './login-screen.css',
})
export class LoginScreen {

  clickLogin = output<void>();
  updateAccessToken = output<string>();

  async logIn() {
    if (!this.isLoginReady()) return;

    const signinJSON = {
      "username": this.loginUsername(),
      "password": this.loginPassword()
    };
    
    fetch("/api/auth/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(signinJSON)
    }).then(async res => {
      try {
        const data = await res.json();
        if (data["access_token"]) {
          this.updateAccessToken.emit(data["access_token"]);
          this.clickLogin.emit();
          console.log(data["access_token"]);
          return;
        }

        if (data["statusCode"] && data["statusCode"]==401) {
          this.loginErrorMessage.set("Nieprawidłowe dane logowania");
        }
      } catch(err) {
        console.log(err);
      }
    })
  }

  // -----

  finishDialogOpen = signal(false);

  openFinishDialog() {
    this.finishDialogOpen.set(true);
  }

  closeFinishDialog() {
    this.finishDialogOpen.set(false);
  }

  closeDialog() {
    this.closeResetDialog();
    this.closeLoginDialog();
    this.closeRegisterDialog();
    this.closeFinishDialog();
  }

  // loginDialog

  loginDialogOpen = signal(false);

  openLoginDialog() {
    this.closeDialog();
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

  loginErrorMessage = linkedSignal(() => {
    return "";
  });

  isLoginReady = computed(() => {
    return this.loginUsername() != "" && this.loginPassword() != "";
  })

  // registerDialog

  registerStepOneDialogOpen = signal(false);
  registerStepTwoDialogOpen = signal(false);

  openRegisterStepOneDialog() {
    this.loginDialogOpen.set(false)
    this.registerStepOneDialogOpen.set(true);
    this.registerStepTwoDialogOpen.set(false);
    this.resetDialogOpen.set(false);
  }

  closeRegisterDialog() {
    this.closeRegisterStepTwoDialog();
    this.registerStepOneDialogOpen.set(false);
    this.registerPassword.set("");
    this.registerRepeatPassword.set("");
    this.registerEmail.set("");
  }

  openRegisterStepTwoDialog() {
    this.loginDialogOpen.set(false);
    this.registerStepOneDialogOpen.set(false);
    this.resetDialogOpen.set(false);
    this.registerStepTwoDialogOpen.set(true);
  }

  closeRegisterStepTwoDialog() {
    this.registerStepTwoDialogOpen.set(false);
    this.registerStepOneDialogOpen.set(true);
    this.registerUsername.set("");
    this.registerStepTwoErrorMessage.set("");
    this.registerImageUrl.set("/default_profile_pic.png");
  }

  registerEmail = signal("");
  registerPassword = signal("");
  registerRepeatPassword = signal("");
  registerUsername = signal("");
  registerImageUrl = signal("/default_profile_pic.png");
  registerImageFile = signal<File | undefined>(undefined);

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
      this.registerImageFile.set(file);

      const url = URL.createObjectURL(file);
      this.registerImageUrl.set(url);
    }
  }

  async createAccount() {
    const uploadToken = (await fetch("/api/auth/preRegister").then(res => res.json()))["upload_token"];
    console.log(uploadToken);

    let file: File;
    if (!this.registerImageFile()) {
      const defaultProfilePicBlob = await fetch("/default_profile_pic.png")
                                      .then(res => res.blob());

      file = new File([defaultProfilePicBlob], "default_profile_pic.png", {type: "image/png"});
    } else {
      file = this.registerImageFile()!;
    }

    const formData = new FormData();
    formData.append("file", file, file.name);

    const imageID = (await fetch("/api/media/upload", {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${uploadToken}`
      }
    }
    )
    .then(res => res.json()))["id"];
    console.log(imageID);

    const signupJSON = {
      "username": this.registerUsername(),
      "email": this.registerEmail(),
      "password": this.registerPassword(),
      "imageId": imageID
    };

    fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(signupJSON)
    }).then(async res => {
      try {
        const data = await res.json();
        if (data["access_token"]) {
          this.updateAccessToken.emit(data["access_token"]);
          this.clickLogin.emit();
          return;
        }

        if (data["statusCode"] && data["statusCode"]==409) {
          this.registerStepTwoErrorMessage.set("Istnieje już konto o podanym e-mailu lub nazwie użytkownika.");
          return;
        }

        if (data["message"]) {
          this.openFinishDialog();
        }
      } catch(err) {
        console.log(err);
      }
    })
  }

  isRegisterStepTwoReady = computed(() => {
    if (!this.isRegisterStepOneReady()) return false;
    if (this.registerUsername() == "") return false;
    if (this.registerImageUrl() == "") return false;
    return true;
  })

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

  registerStepTwoErrorMessage = signal("");

  // reset dialog

  resetDialogOpen = signal(false);

  openResetDialog() {
    this.resetDialogOpen.set(true);
    this.loginDialogOpen.set(false);
  }

  closeResetDialog() {
    this.resetDialogOpen.set(false);
    this.loginDialogOpen.set(true);
    this.resetEmailOrUsername.set("");
  }

  resetEmailOrUsername = signal("");

  updateResetEmailOrUsername($event: any){
    if (!$event.target) return;
    this.resetEmailOrUsername.set($event.target.value);
  }

  resetErrorMessage = computed(() => {
    return "";
  })

  isResetReady = computed(() => {
    return this.resetEmailOrUsername() != "";
  })



}

import { Component, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainPage } from './main-page/main-page';
import { LoginScreen } from './login-screen/login-screen';

@Component({
  selector: 'app-root',
  imports: [MainPage, LoginScreen, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('xitter-frontend');
  loggedIn = signal(false);
  accessToken = signal("");

  clickLogin() {
    this.loggedIn.set(true);
  }

  setAccessToken(token: string) {
    this.accessToken.set(token);
  }

  loggedInUUID = computed(() => {
    try {
      const base64URL = this.accessToken().split(".")[1];
      const base64 = base64URL.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(window.atob(base64).split("").map(function(c){
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));

      return JSON.parse(jsonPayload)["sub"];
    } catch(err) {
      console.log(err)
      return null;
    }
  })

  async clickLogout() {
    await fetch("/api/auth/logout", {method: "POST"});
    this.loggedIn.set(false);
  }

  ngOnInit() {
    // this.clickLogout();
    fetch("/api/auth/refresh", {method: "POST"})
    .then(async res => {
      try {
        const data = await res.json()
        if (data["access_token"]) {
          this.setAccessToken(data["access_token"]);
          this.loggedIn.set(true);
          return;
        }
      } catch(err) {
        console.log("error")
      }
    })
    .catch((err) => {
      console.log(err);
      console.log("ts doesn't work")
    })
  }
}

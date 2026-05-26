import { Component, signal } from '@angular/core';
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

  async clickLogout() {
    await fetch("/api/auth/logout", {method: "POST"});
    this.loggedIn.set(false);
  }

  ngOnInit() {
    this.clickLogout();
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

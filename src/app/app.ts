import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainPage } from './main-page/main-page';
import { LoginScreen } from './login-screen/login-screen';

@Component({
  selector: 'app-root',
  imports: [MainPage, LoginScreen],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('xitter-frontend');
  loggedIn = signal(false);
}

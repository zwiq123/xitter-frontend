import { Component, input, signal, output } from '@angular/core';

@Component({
  selector: 'app-main-page',
  imports: [],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {
  clickLogout = output<void>();

  logout() {
    this.clickLogout.emit();
  }

  loggedInUUID = input.required<string>();
  loggedInProfile = signal<any>({});

  ngOnInit() {
    fetch(`/api/user/${this.loggedInUUID()}`)
    .then(async res => {
      try {
        const data = await res.json();
        console.log(data);
        if (data["id"]) {
          this.loggedInProfile.set(data);
        }
      } catch(err) {
        console.log(err);
      }
    })
  }
}

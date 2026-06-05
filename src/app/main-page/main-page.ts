import { Component, input, signal, output } from '@angular/core';
import { CreatePost } from '../create-post/create-post';
import { Post } from '../post/post';

@Component({
  selector: 'app-main-page',
  imports: [CreatePost, Post],
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
  accessToken = input.required<string>();

  feed = signal<any[]>([])

  ngOnInit() {
    fetch(`/api/user/${this.loggedInUUID()}`)
    .then(async res => {
      try {
        const data = await res.json();
        if (data["id"]) {
          this.loggedInProfile.set(data);
        }
      } catch(err) {
        console.log(err);
      }
    })
    .then(() => {
      fetch("/api/user/feed", {
        headers: {
          "Authorization": `Bearer ${this.accessToken()}`
        }
      })
      .then(res => res.json())
      .then(data => {
        this.feed.set(data);
        console.log(this.feed()[0])
      })
    })
  }

}

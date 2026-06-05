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
  logoutBtnShown = signal(false);

  clickProfilePic() {
    this.logoutBtnShown.set(!this.logoutBtnShown());
  }

  logout() {
    this.clickLogout.emit();
  }

  loggedInUUID = input.required<string>();
  loggedInProfile = signal<any>({});
  accessToken = input.required<string>();

  feed = signal<any[]>([])

  updateFeed() {
    fetch("/api/user/feed", {
      headers: {
        "Authorization": `Bearer ${this.accessToken()}`
      }
    })
    .then(res => res.json())
    .then(data => {
      const feedPosts = [];
      for (const post of data) {
        const postData = post.post;
        const score = post.score;
        if (postData.reposts) {
          continue;
          // feedPosts.push({score, post: {...postData.reposts, repostedBy: postData.reposts.author, author: postData.author}});
        } else {
          feedPosts.push(post);
        }
      }
      this.feed.set(feedPosts);
      console.log(this.feed())
    })
  }

  ngOnInit() {

    // fetch(`/api/post/ce80095d-5c76-4be8-8006-cf45ecef6a54`, {
    //     method: "DELETE",
    //     headers: {
    //       "Authorization": `Bearer ${this.accessToken()}`
    //     }
    //   }
    // )

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
      this.updateFeed();
    })
  }

}

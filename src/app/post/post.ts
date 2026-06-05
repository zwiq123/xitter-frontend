import { DatePipe } from '@angular/common';
import { Component, computed, input, linkedSignal, signal } from '@angular/core';

@Component({
  selector: 'app-post',
  imports: [DatePipe],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class Post {

  accessToken = input.required<string>();
  loggedInProfile = input.required<any>();
  postData = input.required<any>();
  showMedia = computed(() => {
    if (this.repostedBy()) return false
    return this.postData().mediaURLs.length > 0;
  })
  postTextContent = computed(() => {
    const rawText = this.postData().content;

    const escaped = rawText
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const withHashtags = escaped.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
    const withBreaks = withHashtags.replace(/\n/g, '<br>');
    return withBreaks;
  })

  repostedBy = computed(() => {
    if (this.postData().repostedBy) {
      return this.postData().repostedBy;
    } else {
      return null;
    }
  })

  repostedByName = signal("");

  ngOnInit() {

    if (this.repostedBy()) {
      fetch(`/api/user/${this.repostedBy()}`)
      .then(res => res.json())
      .then(data => {
        this.repostedByName.set(data.name);
      })
    }

    fetch(`/api/post/${this.postData().id}/likes`)
    .then(res => res.json())
    .then(data => {
      for (const user of data) {
        if (user.id === this.loggedInProfile().id) {
          this.postLiked.set(true);
          break;
        }
      }
    })

    fetch(`/api/post/${this.postData().id}/repost`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.accessToken()}`
      }
    })
    .then(res => {
      if (res.ok) {
        fetch(`/api/post/${this.postData().id}/repost`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${this.accessToken()}`
          }
        })
        this.postReposted.set(false);
      } else {
        this.postReposted.set(true);
      }
    })
    
  }

  // -----likes-----

  likesCount = linkedSignal(() => {
    return this.postData().likesCount;
  })

  postLiked = signal(false);
  like() {
    fetch(`/api/post/${this.postData().id}/likes`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.accessToken()}`
      }
    })
    .then(res => {
      if (res.ok) {
        this.postLiked.set(true);
        this.likesCount.set(this.likesCount() + 1);  
      }
    })
  }

  unlike() {
    fetch(`/api/post/${this.postData().id}/likes`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${this.accessToken()}`
      }
    })
    .then(res => {
      if (res.ok) {
        this.postLiked.set(false);
        this.likesCount.set(this.likesCount() - 1);
      }
    })
  }

  handleLike() {
    if (this.postLiked()) this.unlike();
    else this.like();
  }

  //-----reposts-----

  repostsCount = linkedSignal(() => {
    return this.postData().repostsCount;
  })

  postReposted = signal(false);
  repost() {
    fetch(`/api/post/${this.postData().id}/repost`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.accessToken()}`
      }
    })
    .then(res => {
      if (res.ok) {
        this.postReposted.set(true);
        this.repostsCount.set(this.repostsCount() + 1);  
      }
    })
  }

  unrepost() {
    fetch(`/api/post/${this.postData().id}/repost`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${this.accessToken()}`
      }
    })
    .then(res => {
      if (res.ok) {
        this.postReposted.set(false);
        this.repostsCount.set(this.repostsCount() - 1);
      }
    })
  }

  handleRepost() {
    if (this.postReposted()) this.unrepost();
    else this.repost();
  }

}

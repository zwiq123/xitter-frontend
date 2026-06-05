import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-post',
  imports: [DatePipe],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class Post {

  postData = input.required<any>();
  showMedia = computed(() => {
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


}

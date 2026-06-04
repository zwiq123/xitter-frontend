import { Component, computed, model } from '@angular/core';

@Component({
  selector: 'app-create-post-textarea',
  imports: [],
  templateUrl: './create-post-textarea.html',
  styleUrl: './create-post-textarea.css',
})
export class CreatePostTextarea {


  text = model("");
  modifiedText = computed(() => {
    const raw = this.text();
    const escaped = raw
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const withHashtags = escaped.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>');
    const withBreaks = withHashtags.replace(/\n/g, '<br>');
    return withBreaks;
  });

  handlePostTextArea($event: Event) {
    const textarea = $event.target as HTMLTextAreaElement;
    textarea.style.height = "24px";

    const newHeight = textarea.scrollHeight;
    const newHeightScaled = Math.floor(newHeight / 24) * 24;

    textarea.style.height = `${newHeightScaled}px`;
    
    this.text.set(textarea.value);
  }

}

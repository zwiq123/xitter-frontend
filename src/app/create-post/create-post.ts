import { Component, computed, input, signal } from '@angular/core';
import { CreatePostTextarea } from '../create-post-textarea/create-post-textarea';

@Component({
  selector: 'app-create-post',
  imports: [CreatePostTextarea],
  templateUrl: './create-post.html',
  styleUrl: './create-post.css',
})
export class CreatePost {

  loggedInProfile = input.required<any>();
  accessToken = input.required<string>();

  postLoading = signal(false);
  postTextContent = signal("");
  postButtonDisabled = computed(() => {
    return this.imageCount() == 0 && this.postTextContent().trim() === "";
  });

  imageUrls = signal<string[]>([]);
  imageFiles = signal<(File | undefined)[]>([]);
  imageCount = computed(() => {
    return this.imageFiles().length;
  })
  firstImageAspectRatio = signal(0);

  addImageToPost($event: any) {
    console.log("hello")
    const input = $event.target as HTMLInputElement;
    
    if (input.files && input.files.length == 1) {
      if (this.imageCount() >= 4) return;
      const file = input.files[0];
      this.imageFiles.set([...this.imageFiles(), file]);

      const url = URL.createObjectURL(file);
      this.imageUrls.set([...this.imageUrls(), url]);

      if (this.imageCount() === 1) {
        const img = new Image();
        img.src = url;
        img.onload = () => {
          const ratio = img.width / img.height;
          this.firstImageAspectRatio.set(ratio);
        };
      }

      input.value = '';
      console.log(this.imageFiles())
      console.log(this.imageUrls())
    }
  }

  async clickPost() {
    this.postLoading.set(true);
    
    const imageIDs = [];
    for (const file of this.imageFiles()) {
      if (!file) continue;

      const formData = new FormData();
      formData.append("file", file, file.name);

      const imageID = (await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Authorization": `Bearer ${this.accessToken()}`
        }
      }
      )
      .then(res => res.json()))["id"];
      imageIDs.push(imageID);
    }

    const postJSON = {
      "content": this.postTextContent(),
      "mediaIds": imageIDs
    }

    console.log(postJSON);

    fetch("/api/post/create", {
      method: "POST",
      body: JSON.stringify(postJSON),
      headers: {
        "Authorization": `Bearer ${this.accessToken()}`,
        "Content-Type": "application/json"
      }
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
    })
  
  }

  removeImage(index: number) {
    const urlToRevoke = this.imageUrls()[index];
    if (urlToRevoke) {
      URL.revokeObjectURL(urlToRevoke);
    }

    this.imageFiles.set(
      this.imageFiles().filter((_, i) => i !== index)
    );

    this.imageUrls.set(
      this.imageUrls().filter((_, i) => i !== index)
    );

    if (this.imageUrls().length > 0 && index === 0) {
      const img = new Image();
      img.src = this.imageUrls()[0];
      img.onload = () => {
        this.firstImageAspectRatio.set(img.width / img.height);
      };
    }
  }

}

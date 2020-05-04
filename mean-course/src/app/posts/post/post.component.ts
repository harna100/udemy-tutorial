import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/posts.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
  @Input() post: Post;
  @Input() userId: string;
  isEditing: boolean;
  formGroup: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required]
  });

  constructor(private postsService: PostsService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.isEditing = false;
    console.log(this.post);
    this.updateEditValues();
  }

  updateEditValues() {
    this.formGroup.patchValue({
      "title": this.post.title,
      "content": this.post.content
    });
  }

  deletePost() {
    this.postsService.deletePost(this.post.id);
  }

  editPost() {
    console.log("Edit post");
    this.isEditing = true;
  }

  doneEditing() {
    if (this.formGroup.invalid) {
        return;
    }

    this.post.title = this.formGroup.value.title;
    this.post.content = this.formGroup.value.content;
    this.formGroup.disable();
    
    this.postsService.editPost(this.post, () => {
      this.formGroup.enable();
      this.isEditing = false;
      this.updateEditValues();
    });
  }

  get title() {
    return this.formGroup.get('title');
  }

  get content() {
    return this.formGroup.get('content');
  }
}

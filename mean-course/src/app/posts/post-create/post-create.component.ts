import { Component } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { NgForm } from '@angular/forms';
import { PostsService } from 'src/app/services/posts.service';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
    enteredTitle = '';
    enteredContent  = '';

    constructor(public postsService: PostsService) {}

    onAddPost(form: NgForm) {
        if (form.invalid) {
            return;
        }
        const newPost: Post = {
            title: form.value.title,
            content: form.value.content,
            id: null,
            userId: null
        };

        this.postsService.addPost(newPost.title, newPost.content);

        form.resetForm();
    }
}

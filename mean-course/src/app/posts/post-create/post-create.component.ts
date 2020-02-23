import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from 'src/app/models/post.model';

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
    enteredTitle = '';
    enteredContent  = '';
    @Output() postCreated = new EventEmitter<Post>();

    onAddPost() {
        const newPost: Post = {
            title: this.enteredTitle,
            content: this.enteredContent
        };
        this.postCreated.emit(newPost);
    }
}

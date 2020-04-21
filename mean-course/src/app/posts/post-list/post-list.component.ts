import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostsService } from 'src/app/services/posts.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls:['post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {

    // posts = [
    //     {title: 'First Post', content: 'This is the first post\'s content'},
    //     {title: 'Second Post', content: 'This is the Second post\'s content'},
    //     {title: 'Third Post', content: 'This is the Third post\'s content'}
    // ];
    posts: Post[] = [];
    private postsSub: Subscription;
    userId: string;

    constructor(public postsService: PostsService, private authService: AuthService) {}

    ngOnInit(): void {
        this.postsService.getPosts();
        this.userId = this.authService.getUserId();
        this.postsSub = this.postsService.getPostUpdatedListener().subscribe((posts: Post[]) => {
            this.posts = posts;
        });
    }

    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
    }

    deletePost(postId: string) {
        this.postsService.deletePost(postId);
    }
}

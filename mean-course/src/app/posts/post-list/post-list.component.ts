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

    posts: Post[] = [];
    private postsSub: Subscription;
    private userIdSetSub: Subscription;
    userId: string;

    constructor(public postsService: PostsService, private authService: AuthService) {}

    ngOnInit(): void {
        this.postsService.getPosts();
        this.postsSub = this.postsService.getPostUpdatedListener().subscribe((posts: Post[]) => {
            this.posts = posts;
        });

        this.userId = this.authService.getUserId();
        this.userIdSetSub = this.authService.userIdSet.subscribe(
            () => {
                this.userId = this.authService.getUserId();
            }
        );

    }

    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
        this.userIdSetSub.unsubscribe();
    }

    deletePost(postId: string) {
        this.postsService.deletePost(postId);
    }
}

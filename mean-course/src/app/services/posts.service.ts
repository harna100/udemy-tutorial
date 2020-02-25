import { Post } from 'src/app/models/post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post []>();

    constructor(private http: HttpClient) {}

    getPosts() {
        this.http.get<{message: string, posts: Post[]}>(environment.getApiUrl('posts'))
        .subscribe((postData) => {
            console.log(postData.message);
            console.log(postData.posts);
            this.posts = postData.posts;
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPostUpdatedListener() {
        return this.postsUpdated.asObservable();
    }

    addPost(title: string, content: string) {
        const post: Post = {id: null, title, content};
        this.http.post<{message: string, post: Post}>(environment.getApiUrl('posts'), post)
        .subscribe(responseData => {
            console.log(responseData.message);
            post.id = responseData.post.id;
            console.log(post);
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
        });
    }

    deletePost(postId: string) {
        console.log("Post ID: " + postId);
        const options = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
            }),
            body: {
              id: postId
            },
        };

        this.http.delete(environment.getApiUrl('posts'), options)
        .subscribe(responseData => {
            console.log(responseData);
            const idxToRemove:number = this.posts.findIndex((post) => post.id === postId);
            console.log("Removing: " + idxToRemove);
            this.posts.splice(idxToRemove, 1);
            this.postsUpdated.next([...this.posts]);
        });
    }
}

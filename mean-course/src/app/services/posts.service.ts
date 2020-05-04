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

    getAuthHeader(): {headers: HttpHeaders, [key: string]: any} {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('jwt')
        });

        const options = { headers };
        return options;
    }

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
        const post: Post = {id: null, title, content, userId: null};
        const options = this.getAuthHeader();
        this.http.post<{message: string, post: Post}>(environment.getApiUrl('posts/action/create'), post, options)
        .subscribe(responseData => {
            console.log(responseData.message);
            post.id = responseData.post.id;
            post.userId = responseData.post.userId;
            console.log(post);
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
        });
    }

    deletePost(postId: string) {
        console.log('Post ID: ' + postId);
        const options = this.getAuthHeader();
        options.body = {
            id: postId
        };

        this.http.delete(environment.getApiUrl('posts/action/delete'), options)
        .subscribe(responseData => {
            console.log(responseData);
            const idxToRemove: number = this.posts.findIndex((post) => post.id === postId);
            console.log('Removing: ' + idxToRemove);
            this.posts.splice(idxToRemove, 1);
            this.postsUpdated.next([...this.posts]);
        });
    }

    editPost(post: Post, successCb) {
        const options = this.getAuthHeader();
        console.log(post);
        this.http.put(environment.getApiUrl('posts/action/edit'), {post}, options)
        .subscribe(responseData => {
            console.log(responseData);
            const idxToUpdate: number = this.posts.findIndex((currPost) => currPost.id === post.id);
            console.log('Updating: ' + idxToUpdate);
            this.posts[idxToUpdate] = post;
            this.postsUpdated.next([...this.posts]);
            successCb();
        });
    }
}

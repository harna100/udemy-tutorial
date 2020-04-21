import { Post } from 'src/app/models/post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
    private posts: Post[] = [];
    private postsUpdated = new Subject<Post []>();

    constructor(private http: HttpClient) {}

    // getPosts() {
    //     this.http.get<{message: string, posts: Post[]}>(environment.getApiUrl('posts'))
    //     .subscribe((postData) => {
    //         console.groupCollapsed(postData.message);
    //         this.posts = postData.posts;
    //         this.postsUpdated.next([...this.posts]);
    //     });
    // }

    // getPostUpdatedListener() {
    //     return this.postsUpdated.asObservable();
    // }

    // addPost(title: string, content: string) {
    //     const post: Post = {id: null, title, content, userId: null};
    //     this.http.post<{message: string, post: Post}>(environment.getApiUrl('posts'), post)
    //     .subscribe(responseData => {
    //         console.log(responseData.message);
    //         this.posts.push(post);
    //         this.postsUpdated.next([...this.posts]);
    //     });
    // }

    isLoggedIn(): boolean {
        return localStorage.getItem('jwt') !== null;
    }

    getUserId(): string {
        const parseJwt = (token) => {
            try {
                return JSON.parse(atob(token.split('.')[1]));
            } catch (e) {
                return null;
            }
        };

        return parseJwt(localStorage.getItem('jwt')).id;
    }
}

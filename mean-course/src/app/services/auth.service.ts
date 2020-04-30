import { Injectable, EventEmitter, Output } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
    @Output() userIdSet = new EventEmitter<void>();
    @Output() loginDidError = new EventEmitter<void>();


    constructor(private http: HttpClient) {}

    login(code: string) {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        const options = { headers };

        this.http.post<{message: string, jwt: string}>(environment.getApiUrl('discord/callback'), {code}, options)
        .subscribe(responseData => {
            this.setUserId(responseData.jwt);
        }, (error) => {
            this.loginDidError.emit();
        });
    }

    setUserId(jwtAnchor: string) {
        localStorage.setItem('jwt', jwtAnchor);
        this.userIdSet.emit();
    }

    isLoggedIn(): boolean {
        return localStorage.getItem('jwt') !== null;
    }

    getUserId(): string {
        if (this.isLoggedIn()) {
            const parseJwt = (token) => {
                try {
                    return JSON.parse(atob(token.split('.')[1]));
                } catch (e) {
                    return null;
                }
            };

            return parseJwt(localStorage.getItem('jwt')).id;
        }
        return '';
    }
}

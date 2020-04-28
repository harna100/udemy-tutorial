import { Injectable, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})
export class AuthService {
    @Output() userIdSet = new EventEmitter<void>();


    constructor(private http: HttpClient) {}



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

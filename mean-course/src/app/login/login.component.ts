import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Post } from 'src/app/models/post.model';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginUrl: string;

    ngOnInit(): void {
        this.loginUrl = environment.getApiUrl('discord/login');

        console.log(this.route.snapshot.paramMap.get('jwt'));
        this.route.fragment.subscribe(
            (jwtAnchor: string) => {
                console.log(jwtAnchor);
                if (jwtAnchor !== null) {
                    localStorage.setItem('jwt', jwtAnchor);
                    this.router.navigateByUrl('posts');
                    return Observable;
                } else {
                    return Observable;
                }
            }
        );
    }

    login(): void {
        this.document.location.href = this.loginUrl;
    }

    constructor(private route: ActivatedRoute,
                private router: Router,
                public authService: AuthService,
                @Inject(DOCUMENT) private document: Document) {}

}

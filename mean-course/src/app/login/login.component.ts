import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    loginUrl: string;
    isLoggingIn: boolean;
    didLoginErr: boolean;
    private userIdSetSub: Subscription;
    private loginDidErrorSub: Subscription;

    ngOnInit(): void {
        this.isLoggingIn = false;
        this.didLoginErr = false;
        this.loginUrl = environment.getApiUrl('discord/login');

        this.userIdSetSub = this.authService.userIdSet.subscribe(
            () => {
                this.isLoggingIn = false;
                this.router.navigateByUrl('posts');
            }
        );

        this.loginDidErrorSub = this.authService.loginDidError.subscribe(
            () => {
                if (! this.authService.isLoggedIn()) {
                    this.isLoggingIn = false;
                    this.didLoginErr = true;
                } else {
                    this.isLoggingIn = false;
                    this.router.navigateByUrl('posts');
                }
            }
        );

        this.route.queryParams.subscribe(
            (params) => {
                console.log(params);
                if (params['code']) {
                    this.authService.login(params['code']);
                    this.isLoggingIn = true;
                    this.router.navigate([], {queryParams: {}, replaceUrl: true});
                }
            }
        );
    }

    ngOnDestroy(): void {
        this.userIdSetSub.unsubscribe();
        this.loginDidErrorSub.unsubscribe();
    }

    login(): void {
        this.document.location.href = this.loginUrl;
    }

    constructor(private route: ActivatedRoute,
                private router: Router,
                public authService: AuthService,
                @Inject(DOCUMENT) private document: Document) {}

}
